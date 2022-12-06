const { sequelize } = require("./connection");
const Device = require("./device");
const Log = require("./log");
const User = require("./user");

const db = {};

db.sequelize = sequelize;

// model 생성
db.User = User;
db.Device = Device;
db.Log = Log;

// model init
User.init(sequelize);
Device.init(sequelize);
Log.init(sequelize);

// association(관계 생성)
User.associate(db);
Device.associate(db);
Log.associate(db);

module.exports = db;
