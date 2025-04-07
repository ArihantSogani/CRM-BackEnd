const express = require("express");
const router = express.Router();
const {
  getCasting,
  getCurrentOrder,
  createCastingData,
  createCastingDataForOrder,
  updateCastingData,
} = require("../../Controller/processControllers/castingController");

router.route("/").post(createCastingData).get(getCasting);
router
  .route("/:orderid")
  .get(getCurrentOrder)
  .post(createCastingDataForOrder)
  .patch(updateCastingData);

module.exports = router;
