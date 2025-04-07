const FillingJewellry = require("../../Models/process/fillingModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const PrePolishing = require("../../Models/process/prepolishModel");
const { get } = require("lodash");
const Orders = require("../../Models/orderModel");

exports.getFilling = catchAsync(async (req, res, next) => {
  const Fillingdata = await FillingJewellry.find();

  res.status(200).json({
    status: "success",
    data: {
      processData: Fillingdata,
    },
  });
});

exports.createFilingData = catchAsync(async (req, res, next) => {
  const newData = await FillingJewellry.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newData,
    },
  });
});

exports.getCurrentOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  const data = await FillingJewellry.findOne({
    order_id: orderid,
  });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});

exports.createFilingDataForOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  await FillingJewellry.findOneAndUpdate(
    {
      order_id: orderid,
    },
    {
      ...req.body,
      underProgress: false,
      timestampOutput: new Date(),
      isCompleted: true,
    }
  );

  const data = await FillingJewellry.findOne({
    order_id: orderid
  })

  const prePolishData = await PrePolishing.create({
    order_id: orderid,
    weightInput: get(data, "weightOutput"),
    quantityInput: get(data, "quantityOutput"),
  });

  await Orders.findByIdAndUpdate(
    { _id: orderid },
    {
      currentProcess: "prePolish",
      prePolish: get(prePolishData, '_id')
    }, {
    runValidators: false
  }
  );

  const processData = await FillingJewellry.findById({ _id: data._id });

  res.status(200).json({
    status: "success",
    data: {
      processData,
    },
  });
});

exports.updateFillingData = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  await FillingJewellry.findOneAndUpdate({ order_id: orderid }, req.body);
  const data = await FillingJewellry.findOne({ order_id: orderid });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});
