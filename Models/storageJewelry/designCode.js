const mongoose = require("mongoose");

const designCode = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please provide design code."],
  },
  gemStone: {
    type: Array,
  },
  gemSize: String,
  availible: {
    type: Boolean,
    default: true,
  },
  image: String,
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: [true, "Please provide company info."],
  },
});

const DesignCodes = mongoose.model("designCode", designCode);

module.exports = DesignCodes;
