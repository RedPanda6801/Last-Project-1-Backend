const express = require("express");
const { verifyToken } = require("../lib/tokenUtil");
const {
  addDevice,
  findAllCycleData,
  findTodayCycleData,
} = require("../controllers/device");
const router = express.Router();

router.get("/insert", addDevice);
router.get("/find-cycle-all", verifyToken, findAllCycleData);
router.get("/find-cycle-today", findTodayCycleData);
module.exports = router;
