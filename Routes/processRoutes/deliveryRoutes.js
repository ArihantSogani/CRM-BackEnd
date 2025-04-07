const express = require("express");
const router = express.Router();
const {
  getDelivery,
  createDeliveryData,
  createDeliveryDataForOrder,
  getCurrentOrder,
} = require("../../Controller/processControllers/deliveryController");

router.route("/").post(createDeliveryData).get(getDelivery);
router.route("/:orderid").post(createDeliveryDataForOrder).get(getCurrentOrder);

module.exports = router;
