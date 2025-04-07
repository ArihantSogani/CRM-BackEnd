const express = require("express");
const router = express.Router();
const {
  protect,
  restrictTo,
  login,
  signup,
  signupCustomer,
  refreshController,
  logout,
  signupCompanyAdmin,
  signupEmployee,
} = require("../Controller/authController");
const {
  getAllUser,
  deleteUser,
  getAllEmployee,
} = require("../Controller/userController");
const upload = require("../utils/imageUpload");
const { companyAdmin } = require("../constants/role.constants");

router.route("/signup").post(upload.single("profileImage"), signup);
router
  .route("/signupEmployee")
  .post(protect, restrictTo("companyAdmin"), signupEmployee);
router
  .route("/signupCompanyAdmin")
  .post(protect, restrictTo("companyAdmin"), signupCompanyAdmin);
router.route("/").post(protect, restrictTo("companyAdmin"), signupCompanyAdmin);
router
  .route("/signupCustomer")
  .post(upload.single("profileImage"), signupCustomer);
router.route("/login").post(login);
router.route("/refresh").get(refreshController);
router.route("/logout").get(logout);
router
  .route("/")
  .get(protect, restrictTo("admin"), getAllUser)
  .delete(protect, deleteUser);
router
  .route("/getAllEmployees")
  .get(protect, restrictTo(companyAdmin), getAllEmployee);
module.exports = router;
