const { getAuthCode, makeEmail } = require("../lib/mailUtil");
const bcrypt = require("bcrypt");
const logger = require("../lib/logger");
const userDao = require("../dao/userDao");

exports.emailsender = async (req, res) => {
  try {
    const params = { email: req.params.email };
    const user = await userDao.selectByEmail(params.email);
    // 유저 메일 중복 예외 처리
    if (user) {
      const error = new Error("(emailsender.findByEmail) No User in DB");
      return res.status(500).json({ error: error.toString() });
    }
    // 랜덤 코드 6자리 생성
    const code = getAuthCode();
    // 메일 보내기
    // email과 code가 유효하면 메일을 보냄
    if (code && email) {
      // html에 랜덤 코드를 담아 넣음
      const html = `<h1>이메일 인증 코드입니다.</h1>
      <h2>${code}</h2>
      <h3>코드를 입력해주세요!</h3>
      `;
      const subject = "이메일 인증 요청 - Edukit";
      const emailMaker = makeEmail(html, subject, email);

      // LocalStorage에 저장하되, 암호화하여 저장 -> 코드 인증 시에 복호화하여 비교
      const hashCode = await bcrypt.hash(code, 12);
      // 메일 전송
      const info = await emailMaker[0].sendMail(emailMaker[1]);
      console.log("메일 정보: ", info);
      logger.info("(emailsender.sendMail) Mail Sending Success!");
      return res.status(200).json({
        hash: hashCode,
        email,
      });
    }
  } catch (error) {
    logger.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
};
// 인증코드 인증
exports.emailauth = async (req, res) => {
  try {
    const { email, code, hash } = req.body;
    // 복호화 해줌
    const result = await bcrypt.compare(code, hash);
    console.log(result);
    if (!result) {
      const error = new Error("Input Code is not Corrected");
      logger.error(error.toString);
      return res.status(500).json({ error: error.toString() });
    } else {
      logger.info("(emailauth.bcrypt.compare)Code is Corrected");
      return res.status(200).json({ email });
    }
  } catch (error) {
    logger.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
};
