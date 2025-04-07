const mongoose = require("mongoose");

const fillingJewellrySchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

fillingJewellrySchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'order_id',
    select: 'currentProcess wastage'
  })

  next();
})

const FillingJewellry = mongoose.model(
  "fillingJewellry",
  fillingJewellrySchema
);

module.exports = FillingJewellry;
