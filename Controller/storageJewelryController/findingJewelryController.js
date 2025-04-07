const FindingStorageJewelry = require("../../Models/storageJewelry/findingStorageJewelry");
const catchAsync = require("../../utils/catchAsync");

exports.getAllFindingJewelrylData = catchAsync(async (req, res, next) => {
  const findingData = await FindingStorageJewelry.find();

  res.status(200).json({
    status: "success",
    data: {
      storageData: findingData
    }
  })
})

exports.createFindJeweleryData = catchAsync(async (req, res, next) => {
  const newData = await FindingStorageJewelry.create(req.body)
  res.status(200).json({
    status: "success",
    data: {
      newData
    }
  })
})