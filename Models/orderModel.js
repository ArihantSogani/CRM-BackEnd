const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    jewelryType: {
      type: String,
      required: [true, "Please provide jewelry type."],
      enum: ["ring", "earring", "bracelet", "necklace"],
    },
    gemStone: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please provide user id."],
    },
    timeStarted: Date,
    timeCompleted: Date,
    comment: String,
    quantity: {
      type: Number,
      default: 1,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    underProcess: {
      type: Boolean,
      default: false,
    },
    currentProcess: {
      type: String,
      enum: [
        "casting",
        "finalPolishing",
        "delivery",
        "filling",
        "prePolish",
        "setting",
        "notStarted",
        "completed",
      ],
      default: "notStarted",
    },
    weightInput: {
      type: mongoose.Decimal128,
      // required: [true, "Please enter the input weight."],
    },
    weightOutput: {
      type: mongoose.Decimal128,
    },
    wastage: mongoose.Decimal128,
    stoneWeightInput: mongoose.Decimal128,
    findingWeight: mongoose.Decimal128,
    stoneWeightOutput: mongoose.Decimal128,
    designCode: {
      type: String,
    },
    design: {
      type: String,
    },
    orderCode: {
      type: String,
      required: [true, "Order code is required"],
    },
    typeofMetal: {
      type: String,
      enum: ["gold22", "gold18", "gold14", "silver"],
      required: [true, "Please provide the type of metal."],
    },
    deliveryDate: Date,
    casting: {
      type: mongoose.Schema.ObjectId,
      ref: "casting",
    },
    filing: {
      type: mongoose.Schema.ObjectId,
      ref: "fillingJewellry",
    },
    finalPolishing: {
      type: mongoose.Schema.ObjectId,
      ref: "finalPolishing",
    },
    prePolish: {
      type: mongoose.Schema.ObjectId,
      ref: "prepolish",
    },
    setting: {
      type: mongoose.Schema.ObjectId,
      ref: "setting",
    },
    delivery: {
      type: mongoose.Schema.ObjectId,
      ref: "delivery",
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
    stoneWastage: {
      type: mongoose.Decimal128,
    },
    ringSize: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// orderSchema.pre(/^find/, async function (next) {
//   this.populate({
//     path: "casting fillingJewellry finalPolishing prepolish setting delivery",
//     strictPopulate: false,
//     // select: '-__v'
//   });
//   next();
// });

const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
