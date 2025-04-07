const express = require("express");
const {
  getAllMetalData,
  createMetalData,
  getGroupData
} = require("../../Controller/storageJewelryController/metalController");
const router = express.Router();

router.route("/").get(getAllMetalData).post(createMetalData);
router.route('/groupData').get(getGroupData);

module.exports = router;
