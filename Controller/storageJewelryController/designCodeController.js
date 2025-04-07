const DesignCodes = require("../../Models/storageJewelry/designCode");
const catchAsync = require("../../utils/catchAsync");
const _ = require("lodash");
const AppError = require("../../utils/appError");

exports.createDesignCode = catchAsync(async (req, res, next) => {
  const designCode = await DesignCodes.create({
    ...req.body,
    company: req.companyId,
  });

  res.status(201).json({
    status: "success",
    data: {
      storageData: designCode,
    },
  });
});

exports.getDesignCodes = catchAsync(async (req, res, next) => {
  const designCodes = await DesignCodes.find({ company: req.companyId });

  res.status(200).json({
    status: "success",
    data: {
      storageData: designCodes,
    },
  });
});

exports.getDesignCode = catchAsync(async (req, res, next) => {
  const { designId } = req.params;
  const designCode = await DesignCodes.findById(designId);

  res.status(200).json({
    status: "success",
    data: {
      storageData: designCode,
    },
  });
});

exports.createMutipleDesignCodes = catchAsync(async (req, res, next) => {
  const { codeArr } = req.body;
  if (!codeArr) {
    return next(new AppError("Please provide design codes array."));
  }
  codeArr.map(async (data) => {
    await DesignCodes.create(data);
  });

  const designCodes = await DesignCodes.find();

  res.status(200).json({
    status: "success",
    data: {
      storageData: designCodes,
    },
  });
});

exports.deleteDesignCode = catchAsync(async (req, res, next) => {
  const { designId } = req.params;
  await DesignCodes.deleteOne({ _id: designId });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateDesignCode = catchAsync(async (req, res, next) => {
  const { designId } = req.params;
  const data = await DesignCodes.findByIdAndUpdate(
    { _id: designId },
    {
      ...req.body,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      storageData: data,
    },
  });
});
