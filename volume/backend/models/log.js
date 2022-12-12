const Sequelize = require("sequelize");

module.exports = class Log extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // log of controlled device
        control: {
          type: Sequelize.STRING(100),
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
