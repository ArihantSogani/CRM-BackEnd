const express = require("express");
const { companyAdmin, employee } = require("../constants/role.constants");
const { protect, restrictTo } = require("../Controller/authController");
const {
  getAllOrders,
  createOrder,
  startProcess,
  getOrder,
  deleteProcess,
  updateOrder,
} = require("../Controller/orderController");
const upload = require("../utils/imageUpload");
const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo(companyAdmin, employee), getAllOrders);

router
  .route("/company/:companyId")
  .post(protect, upload.single("design"), createOrder);

router
  .route("/:id")
  .post(protect, restrictTo(companyAdmin), startProcess)
  .get(protect, restrictTo(companyAdmin), getOrder)
  .patch(protect, restrictTo(companyAdmin), updateOrder)
  .delete(protect, restrictTo(companyAdmin), deleteProcess);

module.exports = router;
