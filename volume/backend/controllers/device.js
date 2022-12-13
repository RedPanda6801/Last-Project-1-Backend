const deviceDao = require("../dao/deviceDao");
const logger = require("../lib/logger");

exports.addDevice = async (req, res) => {
  try {
    const result = await deviceDao.insertDevice();
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.findAllCycleData = async (req, res) => {
  try {
    const data = await deviceDao.selectAllCycle();
    logger.info(`(findAllCycleData.deviceDao.selectAllCycle)Data: ${data}`);
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};
exports.findTodayCycleData = async (req, res) => {
  try {
    const params = {
      date: req.params.date,
    };

    const todayData = await deviceDao.selectTodayCycle(params.date);
    console.log(todayData);
    return res.status(200).json({ data: todayData });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ error });
  }
};
