const Sequelize = require("sequelize");

module.exports = class Log extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        status: {
          type: Sequelize.STRING(10),
        },
        category: {
          type: Sequelize.ENUM("ERROR", "WORKING", "CONNECTING"),
        },
        content: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: true, // createAt, updatedAt
        paranoid: true, // deletedAt
      }
    );
  }
  static associate(db) {
    db.Log.belongsTo(db.Device);
  }
};
