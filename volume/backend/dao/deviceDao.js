const { Cycle } = require("../models/index");
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
  async insertDevice() {
    try {
      const result = await Device.create({
        state: true,
        work: 0,
        product: 0,
        defective: 0,
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async selectAllCycle() {
    try {
      const result = await Cycle.findAll({
        attributes: { exclude: ["updatedAt"] },
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async selectTodayCycle(date) {
    try {
      const { startDate, endDate } = dayUtil.getTodayWorkTime(date);
      console.log(startDate, endDate);
      const result = Cycle.findAll({
        where: { start: { [Op.between]: [startDate, endDate] } },
      });
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
};
module.exports = dao;
