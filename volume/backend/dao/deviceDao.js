const { Cycle, Device, Log } = require("../models/index");
const dayUtil = require("../lib/dayUtil");
const { Op } = require("sequelize");
const { findAll } = require("../models/cycle");

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
      // 추가할 호기 이름 = 마지막 호기 + 1
      const allDevice = await Device.findAll({ attributes: ["name"] });
      // 마지막 장치의 이름 데이터를 받기 위한 코드
      const lastDevice = allDevice[allDevice.length - 1];
      const num = lastDevice ? parseInt(lastDevice.name.split("호기")[0]) : 0;
      // ORM 호출
      const result = await Device.create({
        name: `${num + 1}호기`,
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
  async selectDeviceAll() {
    try {
      const result = await Device.findAll({});
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
};
module.exports = dao;
