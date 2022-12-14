const { User } = require("../models");

const dao = {
  async addAuth(params) {
    try {
      const user = await User.findOne({ where: { id: params.userid } });
      const result = await user.addManagers(params.deviceid);
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
  async selectManage(params) {
    try {
      const user = await User.findOne({ where: { id: params.userid } });
      const result = await user.getManagers();
      return result;
    } catch (error) {
      return new Error(error);
    }
  },
};

module.exports = dao;
