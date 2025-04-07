const express = require("express");
const router = express.Router();
const {
  getFilling,
  createFilingData,
  getCurrentOrder,
  createFilingDataForOrder,
  updateFillingData,
} = require("../../Controller/processControllers/fillingController");

router.route("/").post(createFilingData).get(getFilling);
router.route("/:orderid").get(getCurrentOrder).post(createFilingDataForOrder).patch(updateFillingData);

module.exports = router;
