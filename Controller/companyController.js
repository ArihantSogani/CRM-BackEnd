const Company = require("../Models/companyModel");
const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Session = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
const { get } = require("lodash");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign(
    {
      companyId: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createAndSendToken = async (company, statusCode, res) => {
  const token = signToken(company._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  await Session.create({
    token,
  });

  res.cookie("jwt", token, cookieOptions);

  company.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      company,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  req.body.isApproved = null;
  req.body.isPaidCompany = null;
  const { password, passwordConfirm, email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new AppError("Email Id Already Registered.", 401));
  }


  if (req.file) {
    req.body.logo = process.env.URL + "public/" + req.file.filename;
  }

  if (!passwordConfirm) {
    return next(
      new AppError("Please enter password and password Confirm."),
      400
    );
  }

  if (passwordConfirm !== password) {
    return next(
      new AppError("Password and Password confirm doesnot match", 400)
    );
  }
  const newUser = await User.create({
    name: get(req.body, "name"),
    email: get(req.body, "email"),
    password: get(req.body, "password"),
    mobileNumber: get(req.body, "mobileNumber"),
    role: "companyAdmin",
  });

  const company = await Company.create({ ...req.body, members: [{ userId: get(newUser, "_id") }] });
  await User.findByIdAndUpdate(get(newUser, "_id"), { company: get(company, "_id") });
  createAndSendToken(company, 201, res);
});

exports.companyLogin = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  email = email.toLowerCase();
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const company = await Company.findOne({ email }).select(
    "+password +isApproved +isPaidCompany"
  );

  const { isApproved } = company;

  if (!isApproved) {
    return next(
      new AppError("Your company is not approved. Please Wait for approval."),
      403
    );
  }

  if (
    !company ||
    !(await company.correctPassword(password, company.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createAndSendToken(company, 200, res);
});

exports.getCompanies = catchAsync(async (req, res, next) => {
  const company = await Company.find().select("+isApproved +isPaidCompany");

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});

exports.protectCompany = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentCompany = await Company.findById(
    decoded.id || decoded.companyId
  );
  if (!currentCompany) {
    return next(new AppError("The company does not exists", 401));
  }

  req.company = currentCompany;
  next();
});

exports.addMember = catchAsync(async (req, res, next) => {
  const { _id } = req.company;
  const { userId } = req.params;

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

  companyData.members = companyData.members.push({ userId });

  const company = await Company.findOneAndUpdate(
    {
      _id,
    },
    {
      members: get(companyData, "members"),
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});

exports.addCompanyAdmin = catchAsync(async (req, res, next) => {
  const { _id } = req.company;
  const { userId } = req.params;
  let notRegistered = true;

  const companyData = await Company.findOne({
    _id,
  });

  for (const i in get(companyData, "members")) {
    if (get(companyData, "members")[i].userId.toString() === userId) {
      notRegistered = false;
    }
  }

  if (notRegistered) {
    return next(new AppError("Member not registered in the company.", 400));
  }

  await User.findOneAndUpdate(
    { _id: userId },
    {
      role: "companyAdmin",
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      message: "User profile updated successfully.",
    },
  });
});

exports.companyApprove = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Company.findByIdAndUpdate(
    { _id: id },
    {
      isApproved: true,
    }
  );

  const company = await Company.find().select("+isApproved +isPaidCompany");

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});

exports.companyDenial = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Company.findByIdAndUpdate(
    { _id: id },
    {
      isApproved: false,
    }
  );

  const company = await Company.find().select("+isApproved +isPaidCompany");

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});

exports.companyPaid = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Company.findByIdAndUpdate(
    { _id: id },
    {
      isPaidCompany: true,
    }
  );

  const company = await Company.find().select("+isApproved +isPaidCompany");

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
})

exports.companyNotPaid = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Company.findByIdAndUpdate(
    { _id: id },
    {
      isPaidCompany: false,
    }
  );

  const company = await Company.find().select("+isApproved +isPaidCompany");

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});
