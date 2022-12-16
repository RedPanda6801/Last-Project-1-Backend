const Sequelize = require("sequelize");

module.exports = class Dice extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        one: {
          type: Sequelize.INTEGER,
        },
        two: {
          type: Sequelize.INTEGER,
        },
        three: {
          type: Sequelize.INTEGER,
        },
        four: {
          type: Sequelize.INTEGER,
        },
        five: {
          type: Sequelize.INTEGER,
        },
        six: {
          type: Sequelize.INTEGER,
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
