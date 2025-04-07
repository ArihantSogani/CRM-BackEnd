const { get } = require("lodash");
const MetalStorageJewelry = require("../../Models/storageJewelry/metalStorageModel");
const catchAsync = require("../../utils/catchAsync");

exports.getAllMetalData = catchAsync(async (req, res, next) => {
  const metalData = await MetalStorageJewelry.find();

  res.status(200).json({
    status: "success",
    data: {
      storageData: metalData,
    },
  });
});

exports.createMetalData = catchAsync(async (req, res, next) => {
  const newData = await MetalStorageJewelry.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      newData,
    },
  });
});

exports.getGroupData = catchAsync(async (req, res, next) => {
  const metalData = await MetalStorageJewelry.find();

  let gold22 = { name: "gold22", carat: '22k' },
    gold14 = { name: "gold14", carat: '14k' },
    gold18 = { name: "gold18", carat: '18k' },
    silver = { name: "silver", };

  for (const i in metalData) {
    if (get(metalData[i], "name") === "gold22") {
      gold22.weight =
        get(gold22, "weight", 0) + get(metalData[i], "weight") * 1;
      gold22.price = get(gold22, "price", 0) + get(metalData[i], "price");
    }
    if (get(metalData[i], "name") === "gold14") {
      gold14.weight =
        get(gold14, "weight", 0) + get(metalData[i], "weight.$numberDecimal");
      gold14.price = get(gold14, "price", 0) + get(metalData[i], "price");
    }
    if (get(metalData[i], "name") === "gold18") {
      gold18.weight =
        get(gold18, "weight", 0) + get(metalData[i], "weight.$numberDecimal");
      gold18.price = get(gold18, "price", 0) + get(metalData[i], "price");
    }
    if (get(metalData[i], "name") === "silver") {
      silver.weight =
        get(silver, "weight", 0) + get(metalData[i], "weight.$numberDecimal");
      silver.price = get(silver, "price", 0) + get(metalData[i], "price");
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      storageData: [gold22, gold14, gold18, silver],
    },
  });
});
