// const { User, Department } = require('../models/index');
const { User } = require("../models/index");

const dao = {
  // 유저 아이디 중복 확인
  async SelectByUserId(userid) {
    try {
      const user = await User.findOne({ where: { userid } });
      return user;
    } catch (error) {
      return new Error(error);
    }
  },
  // 등록
  async insert(params) {
    try {
      const insert = await User.create(params);
      const insertedResult = { ...insert };
      delete insertedResult.dataValues.password;
      return insert;
    } catch (error) {
      return new Error(error);
    }
  },
  // 모든 유저의 리스트 조회
  async selectList() {
    try {
      const userList = await User.findAll({
        attributes: {
          exclude: ["password", "deletedAt", "createdAt", "updatedAt"],
        }, // password 필드 제외
      });
      return userList;
    } catch (error) {
      return new Error(error);
    }
  },
  // 상세정보 조회
  async selectInfo(id) {
    try {
      const userinfo = await User.findByPk(id, {
        attributes: { exclude: ["password"] }, // password 필드 제외
      });
      return userinfo;
    } catch (error) {
      return new Error(error);
    }
  },
  // 수정
  async update(lastInfo, params) {
    try {
      console.log("파라미터 뭐지: ", params);
      const updated = await User.update(
        {
          name: params.name ? params.name : lastInfo.name,
          email: params.email ? params.email : lastInfo.email,
          phone: params.phone ? params.phone : lastInfo.phone,
        },
        {
          where: { id: params.id },
        }
      );
      return updated;
    } catch (error) {
      return new Error(error);
    }
  },
  // 삭제
  async delete(params) {
    try {
      const deleted = await User.destroy({
        where: { id: params.id },
      });
      return deleted;
    } catch (error) {
      return new Error(error);
    }
  },
  // 로그인을 위한 사용자 조회
  selectUser(params) {
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ["id", "userid", "password", "name", "role"],
        where: { userid: params.userid },
      })
        .then((selectedOne) => {
          resolve(selectedOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = dao;
