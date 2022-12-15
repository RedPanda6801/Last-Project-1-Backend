const Sequelize = require("sequelize");

module.exports = class Dice extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        one: {
          type: Sequelize.BOOLEAN,
        },
        two: {
          type: Sequelize.BOOLEAN,
        },
        three: {
          type: Sequelize.BOOLEAN,
        },
        four: {
          type: Sequelize.BOOLEAN,
        },
        five: {
          type: Sequelize.BOOLEAN,
        },
        six: {
          type: Sequelize.BOOLEAN,
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: true, // createAt, updatedAt
      }
    );
  }
  static associate(db) {}
};
