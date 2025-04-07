const mongoose = require("mongoose");

const findingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the type of finding.."],
    },
    weight: {
      type: mongoose.Decimal128,
      // required: [true, " Please provide the weight."],
    },
    quantity:{
      type: Number,
      required: [true, 'Please provide the quantity.']
    },
    price: {
      type: Number,
      required: [true, "Please provide price."],
    },
  },
  {
    timestamps: true,
  }
);

const FindingStorageJewelry = mongoose.model("findingStorageJewelry", findingSchema);

module.exports = FindingStorageJewelry;
