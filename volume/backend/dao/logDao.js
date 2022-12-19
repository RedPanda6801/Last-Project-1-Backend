const logger = require("../lib/logger");
const { Cycle, Log, Dice } = require("../models");
const dayUtil = require("../lib/dayUtil");
const { Op } = require("sequelize");

// 한 사이클에서 받은 다이스 숫자 값을 담은 배열을 받음
const dao = {
  async insertCycleData(data) {
    try {
      // 한 사이클에 대한 저장 값들을 정의
      const { userId, deviceId, work, good, bad, start, end } = data;
      console.log(data);
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
      const { startDate, endDate } = dayUtil.getTodayWorkTime();
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
  async setDiceNum(arr) {
    {
      try {
        console.log("들어온 배열:", arr);
        const result = await Dice.create({
          one: arr[0],
          two: arr[1],
          three: arr[2],
          four: arr[3],
          five: arr[4],
          six: arr[5],
        });
        return result;
      } catch (error) {
        console.log(error);
        logger.error(error.toString());
        return new Error(error);
      }
    }
  },
};

module.exports = dao;
