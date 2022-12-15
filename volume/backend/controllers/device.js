const deviceDao = require("../dao/deviceDao");
const logger = require("../lib/logger");
const httpRes = require("../lib/httpResponse");

// 디바이스 추가
exports.addDevice = async (req, res, next) => {
  try {
    // user 정보를 device에 입력하기 위해 파라미터에 넣어줌
    const params = {
      userid: req.decoded.id,
    };
    // 데이터 추가 dao 호출
    const data = await deviceDao.insertDevice(params);
    // 성공시 결과값 리턴
    const response = httpRes.RES_SUCCESS;
    logger.info(`(insert.deviceDao.insertDevice)data : ${data}`);
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
exports.findAllCycleData = async (req, res, next) => {
  try {
    const params = {
      deviceid: req.params.id,
    };
    const data = await deviceDao.selectAllCycle(params);
    logger.info(`(findAllCycleData.deviceDao.selectAllCycle)Data: ${data}`);
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
    const todayData = await deviceDao.selectTodayCycle(params);
    return res.status(200).json({ data: todayData });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
// 현재 디바이스 정보 가져오기
exports.getDeviceData = async (req, res, next) => {
  try {
    // 파라미터 저장
    const params = {
      deviceid: req.params.id,
    };
    // 파라미터가 있는지 확인
    if (!params) {
      const error = httpRes.RES_NOT_NULL;
      logger.error(error.message);
      return res.status(error.code).json(error);
    }
    // DB에서 device를 찾음
    const data = await deviceDao.selectDeviceById(params.deviceid);
    logger.info(
      `(devices.deviceDao.selectDeviceById)data : ${JSON.stringify(data)}`
    );
    const response = httpRes.RES_SUCCESS;
    return res.status(response.code).json({ response, data });
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
    const data = await deviceDao.insertDeviceLog(params);
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
