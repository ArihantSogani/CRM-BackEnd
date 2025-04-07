const { get } = require("lodash");
const Delivery = require("../../Models/process/deliveryModel");
const FinalPolishing = require("../../Models/process/finalPolishingModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Orders = require("../../Models/orderModel");
const moment = require("moment");

exports.getFinalPolishing = catchAsync(async (req, res, next) => {
  const FinalPolishingdata = await FinalPolishing.find();

  res.status(200).json({
    status: "success",
    data: {
      processData: FinalPolishingdata,
    },
  });
});

exports.createFinalPolishing = catchAsync(async (req, res, next) => {
  const newData = await FinalPolishing.create(req.body);
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

  const data = await FinalPolishing.findOne({
    order_id: orderid,
  });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});

exports.createFinalPolishingDataForOrder = catchAsync(
  async (req, res, next) => {
    const { orderid } = req.params;
    const { timeStarted, timeCompleted, totalWastage } = req.body;

    if (!orderid) {
      return next(new AppError("Please provide orderId", 400));
    }

    if (!timeStarted || !totalWastage) {
      return next(new AppError("Please provide proper varialbles."));
    }

    await FinalPolishing.findOneAndUpdate(
      {
        order_id: orderid,
      },
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

    const data = await FinalPolishing.findOne({
      order_id: orderid,
    });

    let diff = 0;

    if (timeCompleted) {
      diff = new Date(timeCompleted) - new Date(timeStarted);
    } else {
      diff = new Date() - new Date(timeStarted);
    }

    const deliveryData = await Delivery.create({
      order_id: orderid,
      weight: get(data, "weightOutput"),
      quantity: get(data, "quantityOutput"),
      timeDuration: moment(diff).format("HH:mm:ss"),
    });

    await Orders.findByIdAndUpdate(
      {
        _id: orderid,
      },
      {
        delivery: get(deliveryData, "_id"),
        currentProcess: "delivery",
        isCompleted: true,
        underProcess: false,
        timeCompleted: new Date(),
        quantityOutput: get(data, "quantityOutput"),
        weightOutput: get(data, "weightOutput"),
        stoneWeightOutput: get(data, "stoneWeightOutput"),
        wastage: totalWastage,
        stoneWastage: get(data, "stoneWastage"),
      },
      {
        runValidators: false,
      }
    );

    const processData = await FinalPolishing.findById({ _id: data._id });

    res.status(200).json({
      status: "success",
      data: {
        processData,
      },
    });
  }
);

exports.updateFinalPolishingData = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  await FinalPolishing.findOneAndUpdate({ order_id: orderid }, req.body);
  const data = await FinalPolishing.findOne({ order_id: orderid });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});
