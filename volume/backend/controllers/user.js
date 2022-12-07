const logger = require("../lib/logger");
const userDao = require("../dao/userDao");

// 현재 사용자 단일 조회
exports.userInfo = async (req, res) => {
  // 토큰에 있는 유저 정보 가져오기
  const id = req.decoded.id;
  try {
    // 단일 조회 로직 호출
    const info = await userDao.selectInfo(id);
    logger.info(`(user.select.result) ${JSON.stringify(info)}`);
    // 결과값 return 하기
    return res.status(200).json(info);
  } catch (error) {
    logger.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
};

// 사용자 정보 수정
exports.userUpdate = async (req, res) => {
  // 기존 사용자 정보를 dao로 가져오기
  let lastInfo = null;
  const params = {
    id: req.decoded.id,
    userid: req.params.userid, // url의 params로 받음
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    phone: req.body.phone,
  };
  // 받은 데이터가 아무것도 없는 예외에 대한 처리
  if (!params || params === {}) {
    const error = new Error("(userUpdate) No data accepted");
    logger.error(error.toString());
    return res.status(500).json(error.toString());
  }
  // 토큰과 params의 userid를 비교
  if (req.decoded.userid !== params.userid) {
    const error = new Error("(userUpdate)userID is Not corrected!");
    logger.error(Error.toString());
    return res.status(500).json(error.toString());
  }
  // 바뀌기 전의 정보를 조회
  try {
    lastInfo = await userDao.selectInfo(params.id);
    if (!lastInfo) {
      const error = new Error("(userDao.selectInfo)No User in DB");
      logger.error(error.toString());
      return res.status(500).json({ error: error.toString() });
    }
    logger.info(`(userDao.selectInfo)lastUserInfo(${lastInfo})`);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
  // 수정 로직 호출
  try {
    const updatedInfo = await userDao.update(lastInfo, params);
    logger.info(`(userDao.update)updatedInfo(${updatedInfo})`);
    return res.status(200).send(`isUpdated : (${Boolean(updatedInfo)})`);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// 사용자 정보 삭제
exports.userDelete = async (req, res) => {
  // 토큰 정보로 유저 정보와 비교
  const params = {
    id: req.decoded.id,
    userid: req.params.userid,
  };
  try {
    const user = await userDao.selectInfo(params.id);
    // DB에 유저가 없으면
    if (!user) {
      const error = new Error("(userDao.selectInfo)No User In DB");
      logger.error(error.toString());
      return res.status(500).json({ error: error.toString() });
    }
    // DB에서 찾은 유저의 아이디와 파라미터의 아이디를 비교
    if (params.userid !== user.userid) {
      const error = new Error("(userDelete.userid)'userid' is Not Correct");
      logger.error(error.toString());
      return res.status(500).json({ error: error.toString() });
    }
  } catch (error) {
    logger.error(error.toString());
    return res.status(500).json({ error: error.toString() });
  }
  // 삭제 로직 호출
  try {
    const deletedUser = await userDao.delete(params);
    logger.info(`(userDao.delete)deltedUser(${deletedUser})`);
    return res.status(200).send(`deleted User : ${deletedUser}`);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};
