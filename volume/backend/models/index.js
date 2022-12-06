const { sequelize } = require("./connection");
const Device = require("./device");
const LogError = require("./logerror");
const LogInfo = require("./loginfo");
const User = require("./user");

const db = {};

db.sequelize = sequelize;

// model 생성
db.User = User;
db.Device = Device;
db.LogError = LogError;
db.LogInfo = LogInfo;

// model init
User.init(sequelize);
Device.init(sequelize);
LogError.init(sequelize);
LogInfo.init(sequelize);

// association(관계 생성)
User.associate(db);
Device.associate(db);
LogError.associate(db);
LogInfo.associate(db);

module.exports = db;
