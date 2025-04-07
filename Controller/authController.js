const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const Session = require("../Models/sessionModel");
const Company = require("../Models/companyModel");
const { customer } = require("../constants/role.constants");
const { addMember } = require("../constants/addMember");

const signToken = (id, companyId) => {
  return jwt.sign(
    {
      id,
      companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createAndSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id, user.company);

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

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  req.body.email = req.body.email.toLowerCase();

  if (req.file) {
    req.body.profileImage = process.env.URL + "public/" + req.file.filename;
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

  const newUser = await User.create(req.body);
  createAndSendToken(newUser, 201, res);
});

exports.signupCustomer = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  req.body.email = req.body.email.toLowerCase();
  req.body.role = customer;

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

  const newUser = await User.create(req.body);
  createAndSendToken(newUser, 201, res);
});

exports.signupCompanyAdmin = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  req.body.email = req.body.email.toLowerCase();
  req.body.role = "companyAdmin";

  if (req.file) {
    req.body.profileImage = process.env.URL + "public/" + req.file.filename;
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
    ...req.body,
    company: req.companyId || req.company._id,
  });
  await addMember(newUser._id);
  createAndSendToken(newUser, 201, res);
});

exports.signupEmployee = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  req.body.email = req.body.email.toLowerCase();
  req.body.role = "employee";

  if (req.file) {
    req.body.profileImage = process.env.URL + "public/" + req.file.filename;
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
    ...req.body,
    company: req.companyId || req.company._id,
  });
  await addMember(newUser._id);
  createAndSendToken(newUser, 201, res);
});

exports.signupCompany = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  req.body.role = "admin";
  req.body.email = req.body.email.toLowerCase();

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

  const newCompany = await Company.create(req.body);
  createAndSendToken(newCompany, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  email = email.toLowerCase();
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
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

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user doesnot exists", 401));
  }

  req.user = currentUser;
  req.companyId = decoded.companyId;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.refreshController = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new AppError("Please login", 400));
  }

  token = req.headers.authorization.split(" ")[1];
  const session = await Session.findOne({ token });

  if (!token || !session) {
    return next(new AppError("Please login", 400));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user = null,
    company = null;

  if (decoded.id) {
    user = await User.findById({ _id: decoded.id });
  }
  if (decoded.companyId) {
    company = await Company.findById({ _id: decoded.companyId });
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
      company,
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new AppError("Please login", 400));
  }

  token = req.headers.authorization.split(" ")[1];
  const session = await Session.findOne({ token });

  if (!token || !session) {
    return next(new AppError("Please login", 400));
  }

  await Session.deleteOne({ token });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
