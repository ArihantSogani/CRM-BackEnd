const catchAsync = require("../utils/catchAsync");
const User = require("../Models/userModel");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  await User.findOneAndDelete({ _id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllAdminUser = catchAsync(async (req, res, next) => {
  const user = await User.find({
    role: "admin",
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAllEmployee = catchAsync(async (req, res, next) => {
  const { user, companyId } = req;
  const data = await User.find({ company: companyId });
  res.status(200).json({
    status: "success",
    data,
  });
});
