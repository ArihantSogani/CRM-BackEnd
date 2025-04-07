const mongoose = require("mongoose");

const prepolishSchema = new mongoose.Schema(
  {
    weightInput: {
      type: mongoose.Decimal128,
      required: [true, "Please enter the input weight."],
    },
    order_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please enter order Id."],
      ref: "orders",
      unique: [true, "Only one order id can be in the same process."],
    }, //object-id
    quantityInput: {
      type: Number,
      required: [true, "Please enter the input quantity."],
    }, //input
    quantityOutput: {
      type: Number,
    }, //output
    weightOutput: {
      type: mongoose.Decimal128,
    },
    wastage: mongoose.Decimal128,
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
    }, //output
  },
  {
    timestamps: true,
  }
);

prepolishSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "order_id",
    select: "currentProcess wastage",
  });

  next();
});

const PrePolish = mongoose.model("prepolish", prepolishSchema);

module.exports = PrePolish;
