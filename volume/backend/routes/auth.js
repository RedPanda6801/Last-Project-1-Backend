const express = require("express");
const { userLogin, userSign } = require("../controllers/auth");
const middleware = require("../lib/middleware");
const router = express.Router();
// user 토큰 발행 (로그인)
router.post("/login", userLogin);
router.post("/sign", middleware.findRootAccount, userSign);

module.exports = router;
