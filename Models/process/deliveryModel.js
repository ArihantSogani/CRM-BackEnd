const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please enter order Id."],
      ref: "orders",
      unique: [true, "Only one order id can be in the same process."],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide the quantity."],
    },
    weight: {
      type: mongoose.Decimal128,
      required: [true, "Please provide the weight."],
    },
    timeDuration: {
      type: String,
    },
    deliveryTime: Date,
    isDelivered: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

deliverySchema.pre(/^find/, async function (next) {
  this.populate({
    path: "order_id",
    select: "currentProcess wastage",
  });

  next();
});

const Delivery = mongoose.model("delivery", deliverySchema);

module.exports = Delivery;
