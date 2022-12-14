const jwt = require("jsonwebtoken");
const httpRes = require("./httpResponse");
const logger = require("./logger");

const secretKey =
  "2B4D6251655468566D597133743677397A24432646294A404E635266556A586E";
const options = {
  expiresIn: "1440m", // 만료시간
};

const tokenUtil = {
  // 토큰 생성
  makeToken(user) {
    const payload = {
      id: user.id,
      userid: user.userid,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, secretKey, options);

    return token;
  },
  verifyRoot(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      if (decoded.role === "관리자") {
        req.decoded = decoded;
        next();
      } else {
        const error = httpRes.RES_UNAUTHORIZED;
        logger.error(`(verifyRoot.decoded)${error.message}`);
        return res.status(error.code).json(error);
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const error = httpRes.RES_UNAUTHORIZED;
        logger.error(`(verifyRoot.decoded)${error.message}`);
        return res.status(error.code).json(error);
      }
      error = httpRes.RES_FORBIDDEN;
      logger.error(error.toString());
      return res.status(error.code).json(error);
    }
  },
  // 토큰 검증
  verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      req.decoded = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const error = httpRes.RES_UNAUTHORIZED;
        logger.error(`(verifyToken.name)${error.message}`);
        return res.status(error.code).json(error);
      }
      error = httpRes.RES_FORBIDDEN;
      logger.error(error.toString());
      return res.status(error.code).json(error);
    }
  },
};

module.exports = tokenUtil;
