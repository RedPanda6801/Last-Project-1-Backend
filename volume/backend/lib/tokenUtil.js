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
  // 관리자 권한인지 확인하는 미들웨어
  verifyRoot(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      if (decoded.role === "관리자") {
        // 관리자 권한은 토큰 갱신 X
        req.decoded = decoded;
        next();
      } else {
        // 관리자가 아니면 401
        const error = httpRes.RES_UNAUTHORIZED;
        logger.error(`(verifyRoot.decoded)${error.message}`);
        return res.status(error.code).json(error);
      }
    } catch (error) {
      // 토큰이 만료되었으면 401
      if (error.name === "TokenExpiredError") {
        const error = httpRes.RES_UNAUTHORIZED;
        logger.error(`(verifyRoot.decoded)${error.message}`);
        return res.status(error.code).json(error);
      }
      // 토큰이 없으면 403
      error = httpRes.RES_FORBIDDEN;
      logger.error(error.toString());
      return res.status(error.code).json(error);
    }
  },
  // 토큰 검증 미들웨어
  verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      req.decoded = decoded;
      next();
    } catch (error) {
      // 토큰이 만료되면 401
      if (error.name === "TokenExpiredError") {
        const error = httpRes.RES_UNAUTHORIZED;
        logger.error(`(verifyToken.name)${error.message}`);
        return res.status(error.code).json(error);
      }
      // 토큰이 없으면 403
      error = httpRes.RES_FORBIDDEN;
      logger.error(error.toString());
      return res.status(error.code).json(error);
    }
  },
};

module.exports = tokenUtil;
