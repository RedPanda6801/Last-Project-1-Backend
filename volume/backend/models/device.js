const Sequelize = require("sequelize");

module.exports = class Device extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        state: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        work: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        product: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        defective: {
          type: Sequelize.INTEGER,
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
    db.Device.belongsTo(db.User);
    db.Device.hasMany(db.Cycle);
    db.Device.hasMany(db.Log);
  }
};
