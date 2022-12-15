const { Cycle, Device, Log } = require("../models/index");
const dayUtil = require("../lib/dayUtil");
const { Op } = require("sequelize");

const dao = {
  async insertCycleData(data) {
    try {
      // 한 사이클에 대한 저장 값들을 정의
      const { userId, deviceId, work, good, bad, start, end } = data;
      // DB에 추가
      const result = await Cycle.create({
        DeviceId: deviceId,
        UserId: userId,
        work,
        good,
        bad,
        start,
        end,
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async insertDevice(params) {
    try {
      const lastData = await Device.findAndCountAll({ attributes: ["name"] });
      const result = await Device.create({
        name: `${lastData.count + 1}호기`,
        UserId: params.userid,
      });
      return result;
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  },
  async selectAllCycle(params) {
    try {
      const result = await Cycle.findAll({
        where: { DeviceId: params.deviceid },
        attributes: { exclude: ["updatedAt"] },
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async selectTodayCycle(params) {
    try {
      const { startDate, endDate } = dayUtil.getTodayWorkTime(params.date);
      console.log(startDate, endDate);
      const result = await Cycle.findAll({
        where: {
          start: { [Op.between]: [startDate, endDate] },
          DeviceId: params.deviceid,
        },
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async selectDeviceById(id) {
    try {
      const result = await Device.findOne({ where: { id } });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async insertDeviceLog(params) {
    try {
      const result = await Log.create({
        DeviceId: params.deviceid,
        UserId: params.userid,
        control: params.control,
        state: params.state,
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
};
module.exports = dao;
