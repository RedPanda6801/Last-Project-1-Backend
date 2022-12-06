const { sequelize } = require('./connection');
// const Department = require('./department');
const User = require('./user');
// const Device = require('./device');

const db = {};

db.sequelize = sequelize;

// model 생성
// db.Department = Department;
db.User = User;
// db.Device = Device;

// model init
// Department.init(sequelize);
User.init(sequelize);
// Device.init(sequelize);

// association(관계 생성) 이해를 위해 하나씩 관계설정함 아래는 한번에 설정
// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });

// association(관계 생성)
// Department.associate(db);
User.associate(db);

module.exports = db;
