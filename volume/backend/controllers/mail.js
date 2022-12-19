const { getAuthCode, makeEmail } = require("../lib/mailUtil");
const bcrypt = require("bcrypt");
const logger = require("../lib/logger");
const userDao = require("../dao/userDao");
const httpRes = require("../lib/httpResponse");

exports.emailsender = async (req, res, next) => {
  try {
    const params = { email: req.params.email };
    logger.info(`(emailsender.params)email: ${params.email}`);
    // 파라미터 값에 대한 확인
    if (!params) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(send-email.params)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 이메일로 유저 정보 찾기
    const user = await userDao.selectByEmail(params.email);
    // 유저 메일 중복 예외 처리
    if (user) {
      const error = httpRes.RES_EXISTED;
      logger.error(`(send-email.userDao.selectByEmail)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 랜덤 코드 6자리 생성
    const code = getAuthCode();
    // 메일 보내기

    // email과 code가 유효하면 메일을 보냄
    if (code && params.email) {
      // html에 랜덤 코드를 담아 넣음
      const html = `<h1>이메일 인증 코드입니다.</h1>
      <h2>${code}</h2>
      <h3>코드를 입력해주세요!</h3>
      `;
      const subject = "이메일 인증 요청 - Edukit";
      const emailMaker = makeEmail(html, subject, params.email);

      // LocalStorage에 저장하되, 암호화하여 저장 -> 코드 인증 시에 복호화하여 비교
      const hashCode = await bcrypt.hash(code, 12);
      // 메일 전송
      const info = await emailMaker[0].sendMail(emailMaker[1]);

      logger.info(`(emailsender.sendMail)info : ${JSON.stringify(info)}`);
      return res.status(200).json({
        hash: hashCode,
        email: params.email,
      });
    }
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
// 인증코드 인증
exports.emailauth = async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      code: req.body.code,
      hash: req.body.hash,
    };
    logger.info(
      `(emailauth.params) email: ${params.email}, code: ${params.code}, hash: ${params.hash}`
    );
    // 파라미터가 온전히 받아졌는지 확인
    if (!params.email || !params.code || !params.hash) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(emailauth.params)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 복호화 해줌
    const result = await bcrypt.compare(params.code, params.hash);
    if (!result) {
      const error = httpRes.RES_WRONG_DATA;
      logger.error(`(emailauth.bcrypt.compare)${error.message}`);
      return res.status(error.code).json(error);
    } else {
      const response = httpRes.RES_SUCCESS;
      logger.info(
        `(emailauth.bcrypt.compare)${response.message} ${params.email}`
      );
      return res.status(response.code).json({ response, email: params.email });
    }
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
