const mongoose = require("mongoose");

const metalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["gold22", "gold18", "gold14", "silver"],
      required: [true, "Please provide the type of metal."],
    },
    weight: {
      type: mongoose.Types.Decimal128,
      required: [true, " Please provide the weight."],
    },
    price: {
      type: Number,
      required: [true, "Please provide price of the product."],
    },
  },
  {
    timestamps: true,
  }
);

const MetalStorageJewelry = mongoose.model("metalStorageJewelry", metalSchema);

module.exports = MetalStorageJewelry;
