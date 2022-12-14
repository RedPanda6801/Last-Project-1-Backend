const logger = require("./logger");
const tokenUtil = require("./tokenUtil");
const { User } = require("../models/index");
const userDao = require("../dao/userDao");
const hashUtil = require("./hashUtil");

const middleware = {
  // 로그인 체크
  isLoggedIn(req, res, next) {
    const token = req.headers && req.headers.token;

    if (token) {
      // 토큰이 있는 경우 토큰 검증을 수행 한다.
      const decoded = tokenUtil.verifyToken(token);

      if (decoded) {
        // 1. 토큰 검증이 성공한 경우 새로 갱신해 준다.
        const newToken = tokenUtil.makeToken(decoded);
        res.set("token", newToken); // header 세팅

        next(); // 미들웨어 통과(계속 진행)
      } else {
        // 2. 토큰 검증이 실패한 경우 401에러를 응답 한다.
        const err = new Error("Unauthorized token");
        logger.error(err.toString());

        res.status(401).json({ err: err.toString() });
      }
    } else {
      // 토큰이 없는 경우 401에러 응답
      const err = new Error("Unauthorized token");
      logger.error(err.toString());

      res.status(401).json({ err: err.toString() });
    }
  },
  // 루트 계정이 없을 때 생성해주는 미들웨어
  async findRootAccount(req, res, next) {
    try {
      // root 계정을 찾기 위한 Dao 호출
      const isRoot = await userDao.selectByUserId(process.env.ROOT_ID);
      logger.debug("(findRootAccount.userDao.selectByUserId)isRoot :", isRoot);

      // Root 계정이 없으면 비밀번호로 한번더 암호화 확인
      if (!isRoot) {
        // 비밀번호 암호화
        const hashPassword = await hashUtil.makePasswordHash(
          process.env.ROOT_PASS
        );
        logger.debug("(findRootAccount.bcrypt.hash)hash :", hashPassword);

        // 그대로 계정을 추가
        const root = User.create({
          name: "관리자 계정",
          userid: process.env.ROOT_ID,
          password: hashPassword,
          role: "관리자",
          email: "root@UVC-company.com",
          phone: "010-1234-5678",
        });
        logger.debug("(middleware.findRootAccount.root)Root Created", root);
      }
      // root가 있든 없든 API로 가야하기 때문에 외부에 next() 실행
      next();
    } catch (error) {
      console.log(error);
      logger.error(error);
      return res.status(500).json(error);
    }
  },
};

module.exports = middleware;
