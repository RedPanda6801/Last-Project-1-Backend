const logger = require("../lib/logger");

exports.giveAuthToClient = async (req, res, next) => {
  try {
  } catch (error) {
    logger.error(error.toString());
    next(error);
  }
};
