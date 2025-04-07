const express = require("express");
const {
  getAllFindingJewelrylData,
  createFindJeweleryData,
} = require("../../Controller/storageJewelryController/findingJewelryController");
const router = express.Router();

router.route("/").get(getAllFindingJewelrylData).post(createFindJeweleryData);

module.exports = router;
