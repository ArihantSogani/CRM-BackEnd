const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { get } = require("lodash");
const Company = require("../Models/companyModel");

exports.addMember = catchAsync(async (req, userId) => {
  let _id = get(req.company, "_id") || req.companyId;

  const companyData = await Company.findOne({
    _id,
  });

  for (const i in get(companyData, "members")) {
    if (get(companyData, "members")[i].userId.toString() === userId) {
      return next(new AppError("Member already registered.", 400));
    }
  }

  await User.findOneAndUpdate(
    { _id: userId },
    {
      company: _id,
    }
  );

  companyData.members = get(companyData, "members")?.push({ userId });

  const company = await Company.findOneAndUpdate(
    {
      _id,
    },
    {
      members: get(companyData, "members"),
    }
  );

  return company;
});
