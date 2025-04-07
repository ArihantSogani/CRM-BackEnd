const express = require("express");
const {
  getAllGemstoneJewelryData,
  createGemstoneJewelryData,
  deleteGemStoneData,
  updateGemStoneData,
} = require("../../Controller/storageJewelryController/gemstoneJewelryController");
const router = express.Router();

router
  .route("/")
  .get(getAllGemstoneJewelryData)
  .post(createGemstoneJewelryData)

router.route('/:id')
  .patch(updateGemStoneData)
  .delete(deleteGemStoneData);

module.exports = router;
