const logger = require("../lib/logger");
const tokenUtil = require("../lib/tokenUtil");
const userService = require("../service/userService");
const userDao = require("../dao/userDao");
const httpRes = require("../lib/httpResponse");

// 회원가입 API
exports.userSign = async (req, res, next) => {
  try {
    // 파라미터에 대한 선언
    const params = {
      name: req.body.name,
      userid: req.body.userid,
      password: req.body.password,
      role: req.body.role,
      email: req.body.email,
      phone: req.body.phone,
    };
    logger.info(`(sign.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.name || !params.userid || !params.password) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(sign.params)${error.message}`);
      res.status(error.code).json(error);
    }

    // DB에 중복된 아이디가 있는지 확인
    if (await userDao.selectByUserId(params.userid)) {
      const error = httpRes.RES_EXISTED;
      logger.error(`(sign.userDao.selectByUserId)${error.message}`);
      res.status(error.code).json(error);
    }

    // 비즈니스 로직 호출
    const result = await userService.signUp(params);
    // 최종 응답
    const response = httpRes.RES_SUCCESS;
    logger.info(`(sign.userService.signUp) ${JSON.stringify(result)}`);
    res.status(response.code).json({ response, result });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};

// 로그인 API
exports.userLogin = async (req, res, next) => {
  try {
    // 로그인 시에 파라미터를 받음
    const params = {
      userid: req.body.userid,
      password: req.body.password,
    };
    logger.info(`(login.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.userid || !params.password) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(login.params)${error.message}`);
      res.status(error.code).json(error);
    }

    // 비즈니스 로직 호출
    const result = await userService.login(params);
    logger.info(`(login.userService.login) ${JSON.stringify(result)}`);
    // 토큰 생성
    const token = tokenUtil.makeToken(result);
    logger.info(`(login.tokenUtil.makeToken) ${JSON.stringify(token)}`);
    // 최종 응답
    const response = httpRes.RES_SUCCESS;
    res.status(response.code).json({ token, response });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
