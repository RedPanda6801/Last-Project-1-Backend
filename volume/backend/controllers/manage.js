const logger = require("../lib/logger");
const httpRes = require("../lib/httpResponse");
const manageDao = require("../dao/manageDao");

exports.giveAuthToClient = async (req, res, next) => {
  try {
    // 파라미터 저장
    const params = {
      userid: req.body.userid,
      deviceid: req.body.deviceid,
    };
    logger.info(`(give-auth.params)${JSON.stringify(params)}`);

    // 파라미터 확인
    if (!params.userid || !params.deviceid) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(give-auth.params)${error.message}`);
      return res.stauts(error.code).json(error);
    }

    // 조인 ORM 추가
    const datas = await manageDao.addAuth(params);
    const data = datas[0];
    // 결과값 확인
    const response = httpRes.RES_SUCCESS;
    logger.info(`(give-auth.manageDao.addAuth)data: ${JSON.stringify(data)}`);
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
exports.getManageList = async (req, res, next) => {
  try {
    // 파라미터 저장
    const params = {
      userid: req.decoded.id,
    };
    // 파라미터 확인
    if (!params.userid) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(get-manage-list.params)${error.toString()}`);
      return res.status(error.code).json(error);
    }
    // DAO 호출
    const data = await manageDao.selectManage(params);
    // 결과값 도출
    const response = httpRes.RES_SUCCESS;
    logger.info(
      `(get-manage-list.manageDao.selectManage)data: ${JSON.stringify(data)}`
    );
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
