const express = require("express");
const { verifyToken, verifyRoot } = require("../lib/tokenUtil");
const {
  addDevice,
  getDeviceData,
  getAllDeviceData,
  deleteDevice,
} = require("../controllers/device");
const router = express.Router();

router.post("/insert", verifyRoot, addDevice);
router.delete("/delete/:id", verifyRoot, deleteDevice);
router.get("/:id", verifyToken, getDeviceData);
router.get("/", verifyRoot, getAllDeviceData);
module.exports = router;
