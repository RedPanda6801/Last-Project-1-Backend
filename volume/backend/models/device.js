const Sequelize = require("sequelize");

module.exports = class Device extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // name of device
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        // emergency of device
        state: {
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

  static associate(db) {
    db.Device.belongsToMany(db.User, {
      through: "Management",
      as: "Actions",
      foreignKey: "deviceId",
    });
    db.Device.hasMany(db.Cycle);
    db.Device.hasMany(db.Log);
  }
};
