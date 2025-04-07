const express = require("express");
const router = express.Router();
const {
  getPrepolish,
  createPolishData,
  createPrePolishingDataForOrder,
  getCurrentOrder,
  updatePrePolishData,
} = require("../../Controller/processControllers/prepolishController");

router.route("/").post(createPolishData).get(getPrepolish);
router
  .route("/:orderid")
  .post(createPrePolishingDataForOrder)
  .get(getCurrentOrder)
  .patch(updatePrePolishData);

module.exports = router;
