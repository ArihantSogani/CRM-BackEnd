const express = require("express");
const router = express.Router();
const {
  getSetting,
  createSettingData,
  createSettingDataForOrder,
  getCurrentOrder,
  updateSettingData,
} = require("../../Controller/processControllers/settingController");

router.route("/").post(createSettingData).get(getSetting);
router
  .route("/:orderid")
  .post(createSettingDataForOrder)
  .get(getCurrentOrder)
  .patch(updateSettingData);

module.exports = router;
