const express = require("express");
const { companyAdmin } = require("../../constants/role.constants");
const { protect, restrictTo } = require("../../Controller/authController");
const {
  createDesignCode,
  getDesignCode,
  getDesignCodes,
  deleteDesignCode,
  updateDesignCode,
} = require("../../Controller/storageJewelryController/designCodeController");
const router = express.Router();

router.route("/").post(createDesignCode).get(getDesignCodes);

router
  .route("/:designId")
  .get(getDesignCode)
  .patch(updateDesignCode)
  .delete(deleteDesignCode);

module.exports = router;
