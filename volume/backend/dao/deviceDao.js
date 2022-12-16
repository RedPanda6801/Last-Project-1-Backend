const { Device } = require("../models/index");
const dao = {
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
  async deleteDeviceById(id) {
    try {
      // id로 삭제
      const result = await Device.destroy({ where: { id } });
      return result;
    } catch (error) {
      console.log(error);
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
