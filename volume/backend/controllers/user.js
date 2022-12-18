const logger = require("../lib/logger");
const userDao = require("../dao/userDao");
const httpRes = require("../lib/httpResponse");

// 현재 사용자 단일 조회
exports.userInfo = async (req, res) => {
  // 토큰에 있는 유저 정보 가져오기
  const params = { id: req.decoded.id };
  try {
    // 단일 조회 로직 호출
    const data = await userDao.selectInfo(params.id);
    logger.info(`(users.params)data: ${JSON.stringify(data)}`);
    // 결과값 return 하기
    const response = httpRes.RES_SUCCESS;
    logger.info(`(user.userDao.selectInfo) ${JSON.stringify(info)}`);
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};

// 사용자 정보 수정
exports.userUpdate = async (req, res) => {
  try {
    const params = {
      id: req.decoded.id,
      userid: req.params.userid, // url의 params로 받음
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    // 받은 데이터가 아무것도 없는 예외에 대한 처리
    if (!params || params === {}) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(update.params)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 토큰과 params의 userid를 비교
    if (req.decoded.userid !== params.userid) {
      const error = httpRes.RES_UNAUTHORIZED;
      logger.error(`(update.params.userid)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 바뀌기 전의 정보를 조회
    const lastInfo = await userDao.selectInfo(params.id);
    logger.info(`(userDao.selectInfo)lastUserInfo(${lastInfo})`);
    // 이전 정보가 없으면 예외 처리
    if (!lastInfo) {
      const error = httpRes.RES_NO_DATA;
      logger.error(`(userDao.selectInfo)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 수정 DAO 호출
    const data = await userDao.update(lastInfo, params);
    logger.info(`(userDao.update)data : ${data}`);
    // 결과값 도출
    const response = httpRes.RES_SUCCESS;
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};

// 사용자 정보 삭제
exports.userDelete = async (req, res) => {
  try {
    // 토큰 정보로 유저 정보와 비교
    const params = {
      id: req.decoded.id,
      userid: req.params.userid,
    };
    // 삭제할 유저를 찾아봄
    const user = await userDao.selectInfo(params.id);
    // DB에 유저가 없으면
    if (!user) {
      const error = httpRes.RES_NO_DATA;
      logger.error(`(delete.userDao.selectInfo)${error.message}`);
      return res.status(error.code).json(error);
    }
    // DB에서 찾은 유저의 아이디와 파라미터의 아이디를 비교
    if (params.userid !== user.userid) {
      const error = httpRes.RES_UNAUTHORIZED;
      logger.error(`(delete.userDao.selectInfo)${error.message}`);
      return res.status(error.code).json(error);
    }
    // 삭제 DAO 호출
    const data = await userDao.delete(params);
    logger.info(`(userDao.delete)deltedUser(${data})`);
    // 결과 도출
    const response = httpRes.RES_SUCCESS;
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};

// 사용자 전체 정보 조회
exports.userList = async (req, res, next) => {
  // 팀원은 조회할 수 없게 함
  if (!(req.decoded.role === "팀장" || req.decoded.role === "관리자")) {
    const error = httpRes.RES_UNAUTHORIZED;
    logger.error(`(list.decoded.role)${error.message}`);
    return res.status(error.code).json(error);
  }
  try {
    // 리스트 조회
    const data = await userDao.selectList();
    // 조회 결과
    const response = httpRes.RES_SUCCESS;
    logger.info(`(list.userDao.selectLst)list : ${JSON.stringify(data)}`);
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
