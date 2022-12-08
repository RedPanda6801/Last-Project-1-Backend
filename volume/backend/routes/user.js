const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");
const userService = require("../service/userService");
const { verifyToken } = require("../lib/tokenUtil");
const { userInfo, userUpdate, userDelete } = require("../controllers/user");

router.get("/", verifyToken, userInfo);
router.put("/update/:userid", verifyToken, userUpdate);
router.delete("/delete/:userid", verifyToken, userDelete);
router.get("/list", verifyToken, userList);

module.exports = router;
