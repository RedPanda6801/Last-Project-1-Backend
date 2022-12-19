const manageDao = require("../dao/manageDao");
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
    const device = await deviceDao.insertDevice(params);
    logger.info(
      `(insert.deviceDao.insertDevice)device : ${JSON.stringify(device)}`
    );
    params.deviceid = device.dataValues.id;
    // 관리자에게 모든 장치를 다루는 권한 부여
    const auth = await manageDao.addAuth(params);
    logger.info(`(insert.manageDao.addAuth)data : ${JSON.stringify(auth)}`);
    // 성공시 결과값 리턴
    const response = httpRes.RES_SUCCESS;
    return res.status(response.code).json({ response, data: { device, auth } });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
exports.deleteDevice = async (req, res, next) => {
  try {
    // 파라미터에 받아온 장치의 id 값을 받아옴
    const params = {
      id: req.params.id,
    };
    // Dao 호출
    const data = await deviceDao.deleteDeviceById(params.id);
    // 결과 확인
    const response = httpRes.RES_SUCCESS;
    logger.info(
      `(delete.deviceDao.deleteDeviceById)data : ${JSON.stringify(data)}`
    );
    return res.status(response.code).json({ response, data });
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

// 디바이스 전체 조회 API
exports.getAllDeviceData = async (req, res, next) => {
  try {
    // 디바이스 전체 조회
    const data = await deviceDao.selectDeviceAll();
    // 결과 확인
    const response = httpRes.RES_SUCCESS;
    logger.info(
      `(devices.deviceDao.selectDeviceAll)data : ${JSON.stringify(data)}`
    );
    return res.status(response.code).json({ response, data });
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
