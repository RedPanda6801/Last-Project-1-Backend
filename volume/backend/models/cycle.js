const Sequelize = require("sequelize");

module.exports = class Cycle extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // amount per one cycle
        work: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        // good or bad
        good: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        bad: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        // time of start
        start: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        // time of end
        end: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
      }
    );
  }
  static associate(db) {
    db.Cycle.belongsTo(db.Device);
    db.Cycle.belongsTo(db.User);
    db.Cycle.hasOne(db.Dice);
  }
};
