const express = require("express");
const { verifyToken } = require("../lib/tokenUtil");
const {
  addDevice,
  findAllCycleData,
  findTodayCycleData,
  getDeviceData,
  controlDevice,
} = require("../controllers/device");
const router = express.Router();

router.post("/insert", verifyToken, addDevice);
router.get("/find-cycle-all", verifyToken, findAllCycleData);
router.get("/find-cycle-today", findTodayCycleData);
router.get("/:id", verifyToken, getDeviceData);
router.post("/control", verifyToken, controlDevice);
module.exports = router;
