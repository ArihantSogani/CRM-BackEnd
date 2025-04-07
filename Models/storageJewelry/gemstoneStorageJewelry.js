const mongoose = require("mongoose");

const gemstoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the type of Gemstone."],
    },
    shape: {
      type: String,
      // required: [true, "Please provide shape of gemstone."],
    },
    size: {
      type: String,
      // required: [true, "Please provide size of gemstone."],
    },
    weight: {
      type: mongoose.Decimal128,
      // required: [true, "Please provide the weight."],
    },
    quantity: {
      type: Number,
      // required: [true, "Please provide the quantity of gemstone."],
    },
    price: {
      type: Number,
      // required: [true, "Please provide price of the product."],
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: [true, "Please provide company info."],
    },
  },
  {
    timestamps: true,
  }
);

const GemstoneStorageJewelry = mongoose.model(
  "gemstoneStorageJewelry",
  gemstoneSchema
);

module.exports = GemstoneStorageJewelry;
