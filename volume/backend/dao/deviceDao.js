const { Cycle } = require("../models/index");

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
};
module.exports = dao;
