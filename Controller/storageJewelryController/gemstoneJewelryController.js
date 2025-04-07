const GemstoneStorageJewelry = require("../../Models/storageJewelry/gemstoneStorageJewelry");
const catchAsync = require("../../utils/catchAsync");

exports.getAllGemstoneJewelryData = catchAsync(async (req, res, next) => {
  const gemstoneData = await GemstoneStorageJewelry.find({
    company: req.companyId,
  });

  res.status(200).json({
    status: "success",
    data: {
      storageData: gemstoneData,
    },
  });
});

exports.createGemstoneJewelryData = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const newData = await GemstoneStorageJewelry.create({
    ...req.body,
    company: req.companyId,
  });

  res.status(200).json({
    status: "success",
    data: {
      storageData: newData,
    },
  });
});

exports.deleteGemStoneData = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await GemstoneStorageJewelry.deleteOne({ _id: id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateGemStoneData = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await GemstoneStorageJewelry.updateOne(
    { _id: id },
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
