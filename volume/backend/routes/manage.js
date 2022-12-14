const express = require("express");
const { verifyToken } = require("../lib/tokenUtil");
const { giveAuthToClient } = require("../controllers/manage");

const router = express.Router();

router.post("/give-auth", verifyToken, giveAuthToClient);

module.exports = router;
