const express = require("express");
const router = express.Router();
const { verifyToken } = require("../lib/tokenUtil");
const {
  userInfo,
  userUpdate,
  userDelete,
  userList,
} = require("../controllers/user");

router.get("/", verifyToken, userInfo);
router.put("/update/:userid", verifyToken, userUpdate);
router.delete("/delete/:userid", verifyToken, userDelete);
router.get("/list", verifyToken, userList);

module.exports = router;
