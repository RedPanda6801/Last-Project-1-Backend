const express = require("express");
const { verifyToken } = require("../lib/tokenUtil");
const { addDevice } = require("../controllers/device");
const router = express.Router();

router.get("/insert", addDevice);

module.exports = router;
