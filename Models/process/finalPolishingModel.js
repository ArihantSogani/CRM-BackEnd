const mongoose = require("mongoose");

const finalPolishingSchema = new mongoose.Schema(
  {
    weightInput: {
      type: mongoose.Decimal128,
      required: [true, "Please enter the input weight."],
    },
    quantityInput: {
      type: Number,
      required: [true, "Please enter the input quantity."],
    },
    order_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please enter order Id."],
      ref: "orders",
      unique: [true, "Only one order id can be in the same process."],
    },
    wastage: mongoose.Decimal128,
    quantityOutput: {
      type: Number,
    },
    weightOutput: {
      type: mongoose.Decimal128,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    underProgress: {
      type: Boolean,
      default: true,
    },
    comment: {
      type: String,
    },
    timestampOutput: {
      type: Date,
    },
    stoneWeightInput: {
      type: mongoose.Decimal128,
      required: [true, "Please enter weight of stone."],
    },
    stoneWeightOutput: {
      type: mongoose.Decimal128,
    },
    stoneWastage: {
      type: mongoose.Decimal128,
    }
  },
  {
    timestamps: true,
  }
);

finalPolishingSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "order_id",
    select: "currentProcess wastage",
  });

  next();
});

const FinalPolishing = mongoose.model("finalPolishing", finalPolishingSchema);

module.exports = FinalPolishing;
