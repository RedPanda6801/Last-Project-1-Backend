const logger = require("../lib/logger");
const tokenUtil = require("../lib/tokenUtil");
const userService = require("../service/userService");
const userDao = require("../dao/userDao");

exports.userSign = async (req, res) => {
  try {
    const params = {
      name: req.body.name,
      userid: req.body.userid,
      password: req.body.password,
      role: req.body.role,
      email: req.body.email,
      phone: req.body.phone,
    };
    logger.info(`(user.reg.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.name || !params.userid || !params.password) {
      const error = new Error("Not allowed null (name, userid, password)");
      logger.error(error.toString());

      res.status(500).json({ error: error.toString() });
    }

    // DB에 중복된 아이디가 있는지 확인
    if (await userDao.selectByUserId(params.userid)) {
      const error = new Error("user id is already existed!");
      logger.error(error.toString());
      res.status(500).json({ error: error.toString() });
    }
    // root계정에 대한 권한 처리
    if (
      params.userid === process.env.ROOT_ID &&
      params.password === process.env.ROOT_PASS
    ) {
      params.role = "관리자";
    } else if (params.role === "관리자") {
      params.role = "직원";
    }

    // 비즈니스 로직 호출
    const result = await userService.reg(params);
    logger.info(`(user.reg.result) ${JSON.stringify(result)}`);
    // 최종 응답
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
      password: req.body.password,
    };
    console.log("파라미터", params);
    logger.info(`(auth.token.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.userid || !params.password) {
      const error = new Error("Not allowed null (userid, password)");
      logger.error(error.toString());

      res.status(500).json({ error: error.toString() });
    }

    // 비즈니스 로직 호출
    const result = await userService.login(params);
    logger.info(`(auth.token.result) ${JSON.stringify(result)}`);

    // 토큰 생성
    const token = tokenUtil.makeToken(result);
    // 최종 응답
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
