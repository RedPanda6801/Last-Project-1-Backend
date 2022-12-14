const logger = require("../lib/logger");
const hashUtil = require("../lib/hashUtil");
const userDao = require("../dao/userDao");
const httpRes = require("../lib/httpResponse");

const service = {
  // user 입력
  async signUp(params) {
    // root 이외의 계정에 대한 권한 처리
    if (
      params.userid === process.env.ROOT_ID &&
      params.password === process.env.ROOT_PASS
    ) {
      params.role = "관리자";
    } else if (params.role === "관리자") {
      params.role = "직원";
    }

    let inserted = null;

    // 비밀번호 암호화
    let hashPassword = null;
    try {
      hashPassword = await hashUtil.makePasswordHash(params.password);
      logger.debug(
        `(userService.hashUtil.makePasswordHash) ${JSON.stringify(
          params.password
        )}`
      );
      // 500 에러에 대한 처리
    } catch (error) {
      return new Error(error);
    }

    // 사용자 등록 처리
    const newParams = {
      ...params,
      password: hashPassword,
    };
    try {
      inserted = await userDao.insert(newParams);
      logger.debug(`(userService.userDao.insert) ${JSON.stringify(inserted)}`);
    } catch (error) {
      return new Error(error);
    }
    // 결과값 리턴
    return inserted;
  },
  // login 프로세스
  async login(params) {
    // 1. 사용자 조회
    let user = null;
    try {
      user = await userDao.selectUser(params);
      logger.debug(`(userService.userDao.selectUser) ${JSON.stringify(user)}`);

      // 해당 사용자가 없는 경우 튕겨냄
      if (!user) {
        const error = httpRes.RES_LOGIN_FAILED;
        logger.error(error.message);
        return new Promise((res, rej) => {
          rej(error);
        });
      }
    } catch (error) {
      logger.error(`${error.toString()}`);
      return new Promise((res, rej) => {
        rej(error);
      });
    }

    // 비밀번호 비교
    try {
      const checkPassword = await hashUtil.checkPasswordHash(
        params.password,
        user.password
      );
      logger.debug(`(userService.hashUtil.checkPasswordHash) ${checkPassword}`);

      // 비밀번호 틀린 경우 튕겨냄
      if (!checkPassword) {
        const error = httpRes.RES_LOGIN_FAILED;
        logger.error(error.message);

        return new Promise((res, rej) => {
          rej(error);
        });
      }
    } catch (error) {
      logger.error(
        `(userService.hashUtil.checkPasswordHash) ${error.toString()}`
      );
      return new Promise((res, rej) => {
        rej(error);
      });
    }
    return user;
  },
};

module.exports = service;
