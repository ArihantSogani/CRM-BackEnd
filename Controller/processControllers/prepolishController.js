const PrePolish = require("../../Models/process/prepolishModel");
const catchAsync = require("../../utils/catchAsync");
const Setting = require("../../Models/process/settingModel");
const { get } = require("lodash");
const Orders = require("../../Models/orderModel");
const AppError = require("../../utils/appError");

exports.getPrepolish = catchAsync(async (req, res, next) => {
  const Prepolishdata = await PrePolish.find();

  res.status(200).json({
    status: "success",
    data: {
      processData: Prepolishdata,
    },
  });
});

exports.createPolishData = catchAsync(async (req, res, next) => {
  const newData = await PrePolish.create(req.body);
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

  const data = await PrePolish.findOne({
    order_id: orderid,
  });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});

exports.createPrePolishingDataForOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;
  const { jewelryType, designCode, typeOfStone } = req.body;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  if (!jewelryType || !typeOfStone) {
    return next(new AppError("Please provide proper varialbles."));
  }

  await PrePolish.findOneAndUpdate(
    { order_id: orderid },
    {
      ...req.body,
      underProgress: false,
      timestampOutput: new Date(),
      isCompleted: true,
    }, {
    runValidators: false
  }
  );

  const data = await PrePolish.findOne({
    order_id: orderid
  })

  const settingData = await Setting.create({
    order_id: orderid,
    weightInput: get(data, "weightOutput"),
    quantityInput: get(data, "quantityOutput"),
    jewelryType: jewelryType,
    designCode: designCode,
    typeOfStone: typeOfStone,
  });

  await Orders.findByIdAndUpdate(
    {
      _id: orderid,
    },
    {
      setting: get(settingData, "_id"),
      currentProcess: "setting",
    }
  );

  const processData = await PrePolish.findById({ _id: data._id });

  res.status(200).json({
    status: "success",
    data: {
      processData,
    },
  });
});

exports.updatePrePolishData = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  await PrePolish.findOneAndUpdate({ order_id: orderid }, req.body);
  const data = await PrePolish.findOne({ order_id: orderid });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});
