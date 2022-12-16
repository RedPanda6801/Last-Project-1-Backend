const deviceDao = require("../dao/deviceDao");
const logDao = require("../dao/logDao");
const logger = require("../lib/logger");
const httpRes = require("../lib/httpResponse");

exports.findAllCycleData = async (req, res, next) => {
  try {
    const params = {
      deviceid: req.params.id,
    };
    const data = await logDao.selectAllCycle(params);
    logger.info(`(findAllCycleData.logDao.selectAllCycle)Data: ${data}`);
    return res.status(200).json({ data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
exports.findTodayCycleData = async (req, res, next) => {
  try {
    const params = {
      date: req.params.date,
      deviceid: req.params.id,
    };
    const todayData = await logDao.selectTodayCycle(params);
    return res.status(200).json({ data: todayData });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
// 클라이언트 제어에 대한 로그 추가 API
exports.controlDevice = async (req, res, next) => {
  try {
    // 파라미터 세팅
    const params = {
      userid: req.decoded.id,
      deviceid: req.body.deviceid,
      control: req.body.control,
      state: req.body.state,
    };

    // 파라미터 확인
    if (
      !params.userid ||
      !params.deviceid ||
      !params.control ||
      params.state === undefined ||
      params.state === null
    ) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(`(control.params)${error.message}`);
      return res.status(error.code).json(error);
    }

    // 디바이스 확인
    if (!(await deviceDao.selectDeviceById(params.deviceid))) {
      const error = httpRes.RES_NO_DATA;
      logger.error(`(control.deviceDao.selectDeviceById)${error.message}`);
      return res.status(error.code).json(error);
    }

    // 작업 종류 확인
    if (
      !(
        params.control === "START" ||
        params.control === "STOP" ||
        params.control === "RESET"
      )
    ) {
      const error = httpRes.RES_WRONG_DATA;
      logger.error(`(control.params.control)${error.message}`);
      return res.status(error.code).json(error);
    }

    // 제어 로그 추가
    const data = await logDao.insertDeviceLog(params);
    delete data.dataValues.updatedAt;
    delete data.dataValues.createdAt;
    console.log(data);
    // 로그 추가 결과
    const response = httpRes.RES_SUCCESS;
    logger.info(
      `(control.deivceDao.insertDeviceLog)data : ${JSON.stringify(data)}`
    );
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
