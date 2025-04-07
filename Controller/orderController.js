const { get } = require("lodash");
const Orders = require("../Models/orderModel");
const Casting = require("../Models/process/castingModel");
const APIfeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const FillingJewellry = require("../Models/process/fillingModel");
const FinalPolishing = require("../Models/process/finalPolishingModel");
const Delivery = require("../Models/process/deliveryModel");
const PrePolish = require("../Models/process/prepolishModel");
const Setting = require("../Models/process/settingModel");

const countOngoingOrder = (orders) => {
  let onGoingOrders = 0;

  for (const i in orders) {
    if (orders[i].underProcess) {
      onGoingOrders += 1;
    }
  }

  return onGoingOrders;
};

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { companyId } = req;

  const features = new APIfeatures(
    Orders.find({ company: companyId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  const onGoingOrders = countOngoingOrder(orders);

  res.status(200).json({
    status: "success",
    data: {
      onGoingOrders,
      totalOrders: orders.length,
      orders,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { companyId } = req.params;

  const pattern = "Order-";
  const previousOrders = await Orders.find({ company: companyId });

  const orderCode =
    pattern +
    (previousOrders.length !== 0
      ? previousOrders[previousOrders.length - 1].orderCode.split("-")[1] * 1 +
        1
      : 1
    ).toString();

  let design = null;

  if (req.file) {
    design = process.env.URL + "public/" + req.file.filename;
    req.body.design = design;
  }

  const newOrder = await Orders.create({
    ...req.body,
    orderCode,
    company: companyId,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      orders: newOrder,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderData = await Orders.findById({ _id: id }).populate({
    path: "casting filing finalPolishing prePolish setting delivery",
    strictPopulate: false,
  });

  res.status(200).json({
    status: "success",
    data: {
      orders: orderData,
    },
  });
});

exports.deleteProcess = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Orders.deleteOne({ _id: id });
  await Casting.deleteOne({ order_id: id });
  await FillingJewellry.deleteOne({ order_id: id });
  await FinalPolishing.deleteOne({ order_id: id });
  await Delivery.deleteOne({ order_id: id });
  await PrePolish.deleteOne({ order_id: id });
  await Setting.deleteOne({ order_id: id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.startProcess = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { weightInput, quantityInput } = req.body;

  if (!quantityInput) {
    return next(new AppError("Please provide proper varialbles."));
  }

  const castingData = await Casting.create({
    order_id: id,
    weightInput,
    quantityInput,
  });

  await Orders.findByIdAndUpdate(
    { _id: id },
    {
      currentProcess: "casting",
      underProcess: true,
      timeStarted: new Date(),
      casting: get(castingData, "_id"),
    }
  );

  const orders = await Orders.findById({ _id: id }).populate("casting");

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { weightInput } = req.body;

  await Orders.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (weightInput) {
    await Casting.findOneAndUpdate(
      { order_id: id },
      {
        weightInput,
      }
    );
  }

  const orders = await Orders.findById({ _id: id });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
