const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../Controller/authController");
const castingRouter = require("./processRoutes/castingRoutes");
const finalPolishingRouter = require("./processRoutes/finalPolishingRoutes");
const deliveryRouter = require("./processRoutes/deliveryRoutes");
const fillingRouter = require("./processRoutes/fillingRoutes");
const prepolishRouter = require("./processRoutes/prepolishRoutes");
const settingRouter = require("./processRoutes/settingRoutes");
const { companyAdmin } = require("../constants/role.constants");

router.use("/casting", protect, restrictTo(companyAdmin), castingRouter);
router.use(
  "/finalPolishing",
  protect,
  restrictTo(companyAdmin),
  finalPolishingRouter
);
router.use("/delivery", protect, restrictTo(companyAdmin), deliveryRouter);
router.use("/filling", protect, restrictTo(companyAdmin), fillingRouter);
router.use("/prepolish", protect, restrictTo(companyAdmin), prepolishRouter);
router.use("/setting", protect, restrictTo(companyAdmin), settingRouter);

module.exports = router;
