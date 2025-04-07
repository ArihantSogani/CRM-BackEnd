const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name of the company is required."],
      unique: [true, "Name must be unique of a company."],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please enter a valid e-mail"],
      required: [true, "Please enter email address."],
      unique: [true, "Email address must be unique."],
    },
    password: {
      type: String,
      required: [true, "Enter Your Password"],
      minlength: [8, "password Length must be 8 characters"],
      select: false,
    },
    logo: String,
    members: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
      select: false,
    },
    isPaidCompany: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

companySchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

companySchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
