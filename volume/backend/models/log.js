const Sequelize = require("sequelize");

module.exports = class Log extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // log of controlled device(start, stop, reset)
        control: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        // state of emergency(emergency is FALSE)
        state: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: true, // createAt, updatedAt
      }
    );
  }
  static associate(db) {
    db.Log.belongsTo(db.Device);
    db.Log.belongsTo(db.User);
  }
};
