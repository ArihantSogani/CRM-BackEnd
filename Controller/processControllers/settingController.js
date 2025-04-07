const FinalPolishing = require("../../Models/process/finalPolishingModel");
const Setting = require("../../Models/process/settingModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { get } = require("lodash");
const Orders = require("../../Models/orderModel");

exports.getSetting = catchAsync(async (req, res, next) => {
  const Settingdata = await Setting.find();

  res.status(200).json({
    status: "success",
    data: {
      processData: Settingdata,
    },
  });
});

exports.createSettingData = catchAsync(async (req, res, next) => {
  const newData = await Setting.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      processData: newData,
    },
  });
});

exports.getCurrentOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  const data = await Setting.findOne({
    order_id: orderid,
  });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});

exports.createSettingDataForOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  await Setting.findOneAndUpdate(
    { order_id: orderid },
    {
      ...req.body,
      underProgress: false,
      timestampOutput: new Date(),
      isCompleted: true,
    },
    {
      runValidators: false,
    }
  );

  const data = await Setting.findOne({
    order_id: orderid,
  });

  const finalPolishingData = await FinalPolishing.create({
    order_id: orderid,
    weightInput: get(data, "weightOutput"),
    quantityInput: get(data, "quantityOutput"),
    stoneWeightInput: get(data, "stoneWeightInput"),
  });

  await Orders.findByIdAndUpdate(
    { _id: orderid },
    {
      currentProcess: "finalPolishing",
      finalPolishing: get(finalPolishingData, "_id"),
      findingWeight: get(data, "weightOfFinding"),
      stoneWeightInput: get(data, "stoneWeightInput"),
    },
    {
      runValidators: false,
    }
  );

  const processData = await Setting.findById({ _id: data._id });

  res.status(200).json({
    status: "success",
    data: {
      processData,
    },
  });
});

exports.updateSettingData = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  await Setting.findOneAndUpdate({ order_id: orderid }, req.body);
  const data = await Setting.findOne({ order_id: orderid });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});
