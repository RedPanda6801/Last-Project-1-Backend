const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");
const userService = require("../service/userService");
const { verifyToken } = require("../lib/tokenUtil");
const { userInfo, userUpdate, userDelete } = require("../controllers/user");

router.get("/", verifyToken, userInfo);
router.put("/update/:userid", verifyToken, userUpdate);
router.delete("/delete/:userid", verifyToken, userDelete);
// 리스트 조회
router.get("/list", async (req, res) => {
  try {
    const params = {
      name: req.query.name,
      userid: req.query.userid,
    };
    logger.info(`(user.list.params) ${JSON.stringify(params)}`);

    const result = await userService.list(params);
    logger.info(`(user.list.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

module.exports = router;
