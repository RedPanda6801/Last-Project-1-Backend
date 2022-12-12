const express = require("express");
const { userLogin, userSign } = require("../controllers/auth");

const router = express.Router();
// user 토큰 발행 (로그인)
router.post("/login", userLogin);
router.post("/sign", userSign);

module.exports = router;
