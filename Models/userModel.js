const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      unique: [true, "Please enter unique name."],
    },
    email: {
      type: String,
      required: [true, "Please enter email address."],
      unique: [true, "Email address must be unique."],
      validate: [validator.isEmail, "Please enter a valid e-mail"],
    },
    profileImage: {
      type: String,
      default: "https://media.istockphoto.com/vectors/man-icon-black-icon-person-symbol-vector-id1332100919?b=1&k=20&m=1332100919&s=170667a&w=0&h=tdI7XBXQ-Yja7laUteg0v82VG6FqLlQR9TG0Ag6vyvA="
    },
    password: {
      type: String,
      required: [true, "Enter Your Password"],
      minlength: [8, "password Length must be 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "companyAdmin", "employee", "customer"],
      default: "customer",
    },
    mobileNumber: {
      type: Number,
      required: [true, "Please provide your mobile Number"],
      unique: [true, "This number is already registered"],
      validate: [
        function () {
          if (this.mobileNumber.toString().length === 10) {
            return true;
          }
          return false;
        },
        "Please Enter a valide mobile number.",
      ],
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
