const { request } = require("express");
const jwt = require("jsonwebtoken");

const secretKey =
  "2B4D6251655468566D597133743677397A24432646294A404E635266556A586E";
const options = {
  expiresIn: "2h", // 만료시간
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
  // 토큰 검증
  verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      req.decoded = decoded;
      next();
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

module.exports = tokenUtil;
