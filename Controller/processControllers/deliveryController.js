const Orders = require("../../Models/orderModel");
const Delivery = require("../../Models/process/deliveryModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.getDelivery = catchAsync(async (req, res, next) => {
  const Deliverydata = await Delivery.find();

  res.status(200).json({
    status: "success",
    data: {
      processData: Deliverydata,
    },
  });
});

exports.createDeliveryData = catchAsync(async (req, res, next) => {
  const newData = await Delivery.create(req.body);

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

  const data = await Delivery.findOne({
    order_id: orderid,
  });

  res.status(200).json({
    status: "success",
    data: {
      processData: data,
    },
  });
});

exports.createDeliveryDataForOrder = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  if (!orderid) {
    return next(new AppError("Please provide orderId", 400));
  }

  await Delivery.findOneAndUpdate(
    {
      order_id: orderid,
    },
    {
      ...req.body,
      underProgress: false,
      isCompleted: true,
      deliveryDate: new Date(),
    },
    {
      runValidators: false,
    }
  );

  const data = await Delivery.findOne({
    order_id: orderid
  })

  await Orders.findByIdAndUpdate(
    { _id: orderid },
    {
      underProcess: false,
      isCompleted: true,
      timeCompleted: new Date(),
    },
    {
      runValidators: false,
    }
  );

  const processData = await Delivery.findById({ _id: data._id });

  res.status(200).json({
    status: "success",
    data: {
      processData,
    },
  });
});
