const express = require("express");
const { verifyToken, verifyRoot } = require("../lib/tokenUtil");
const {
  findAllCycleData,
  findTodayCycleData,
  controlDevice,
} = require("../controllers/log");
const router = express.Router();

router.get("/find-cycle-all/:id", findAllCycleData);
router.get("/find-cycle-today/:id", findTodayCycleData);
router.post("/control", verifyToken, controlDevice);

module.exports = router;
