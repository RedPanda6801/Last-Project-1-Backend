const logger = require("../lib/logger");
const { Dice } = require("../models");

// 한 사이클에서 받은 다이스 숫자 값을 담은 배열을 받음
exports.setDiceNum = async (arr) => {
  try {
    console.log("들어온 배열:", arr);
    const result = await Dice.create({
      one: arr[0],
      two: arr[1],
      three: arr[2],
      four: arr[3],
      five: arr[4],
      six: arr[5],
    });
    return result;
  } catch (error) {
    logger.error(error.toString());
    return new Error(error);
  }
};
