const express = require("express");
const { protect, restrictTo } = require("../Controller/authController");
const router = express.Router();
const metalStorageRouter = require("./jewelryStorageRoutes/metalStorageRoutes");
const gemstoneJewelryStorageRouter = require("./jewelryStorageRoutes/gemstoneJewelryRoutes");
const findingJewelryStorageRouter = require("./jewelryStorageRoutes/findingJewelryRoutes");
const { companyAdmin } = require("../constants/role.constants");
const designCodeRouter = require("./jewelryStorageRoutes/designCodeRoutes");

//Jewelry Routes
router.use(
  "/jewelry/metal",
  protect,
  restrictTo(companyAdmin),
  metalStorageRouter
);
router.use(
  "/jewelry/gemstone",
  protect,
  restrictTo(companyAdmin),
  gemstoneJewelryStorageRouter
);
router.use(
  "/jewelry/finding",
  protect,
  restrictTo(companyAdmin),
  findingJewelryStorageRouter
);
router.use(
  "/jewelry/designcode",
  protect,
  restrictTo(companyAdmin),
  designCodeRouter
);

module.exports = router;
