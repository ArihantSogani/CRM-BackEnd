const express = require("express");
const router = express.Router();
const {
  getFinalPolishing,
  createFinalPolishing,
  getCurrentOrder,
  createFinalPolishingDataForOrder,
  updateFinalPolishingData,
} = require("../../Controller/processControllers/finalPolshingController");

router.route("/").post(createFinalPolishing).get(getFinalPolishing);
router
  .route("/:orderid")
  .post(createFinalPolishingDataForOrder)
  .get(getCurrentOrder)
  .patch(updateFinalPolishingData);

module.exports = router;
