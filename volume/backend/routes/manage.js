const express = require("express");
const { verifyRoot, verifyToken } = require("../lib/tokenUtil");
const { giveAuthToClient, getManageList } = require("../controllers/manage");

const router = express.Router();

// 장치 제어 권한 부여는 관리자만 가능
router.post("/give-auth", verifyRoot, giveAuthToClient);

router.get("/get-manage-list", verifyToken, getManageList);

module.exports = router;
