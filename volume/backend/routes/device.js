const express = require("express");
const { verifyToken, verifyRoot } = require("../lib/tokenUtil");
const {
  addDevice,
  findAllCycleData,
  findTodayCycleData,
  getDeviceData,
  controlDevice,
} = require("../controllers/device");
const router = express.Router();

router.post("/insert", verifyRoot, addDevice);
router.get("/find-cycle-all", findAllCycleData);
router.get("/find-cycle-today", findTodayCycleData);
router.get("/:id", verifyToken, getDeviceData);
router.post("/control", verifyToken, controlDevice);
module.exports = router;
