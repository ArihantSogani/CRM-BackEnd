const { get } = require("lodash");
const Casting = require("../../Models/process/castingModel");
const FillingJewellry = require("../../Models/process/fillingModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Orders = require("../../Models/orderModel");

exports.getCasting = catchAsync(async (req, res, next) => {
  const Castingdata = await Casting.find();

  res.status(200).json({
    status: "success",
    data: {
      processData: Castingdata,
    },
  });
});

exports.createCastingData = catchAsync(async (req, res, next) => {
  const newData = await Casting.create(req.body);

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

  const data = await Casting.findOne({
    order_id: orderid,
  });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});

exports.createCastingDataForOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  await Casting.findOneAndUpdate(
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

  const data = await Casting.findOne({
    order_id: orderid,
  });

  const filingData = await FillingJewellry.create({
    order_id: orderid,
    weightInput: get(data, "weightOutput"),
    quantityInput: get(data, "quantityOutput"),
  });

  await Orders.findByIdAndUpdate(
    { _id: orderid },
    {
      weightInput: get(data, "weightInput"),
      currentProcess: "filling",
      filing: get(filingData, "_id"),
    }
  );

  const processData = await Casting.findById({ _id: data._id });

  res.status(200).json({
    status: "success",
    data: {
      processData,
    },
  });
});

exports.updateCastingData = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  await Casting.findOneAndUpdate({ order_id: orderid }, req.body);
  const data = await Casting.findOne({ order_id: orderid });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});
