const logger = require("../lib/logger");

// 한 사이클에서 받은 다이스 숫자 값을 담은 배열을 받음
exports.setDiceNum = async (numArr) => {
  try {
    console.log(numArr);
  } catch (error) {
    logger.error(error.toString());
    return res.status;
  }
};
