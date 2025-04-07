const express = require("express");
const { admin } = require("../constants/role.constants");
const {
  protect,
  restrictTo,
  signupCompanyAdmin,
  signupEmployee,
} = require("../Controller/authController");
const {
  signUp,
  companyLogin,
  getCompanies,
  addMember,
  protectCompany,
  addCompanyAdmin,
  companyApprove,
  companyDenial,
  companyPaid,
  companyNotPaid,
} = require("../Controller/companyController");
const upload = require("../utils/imageUpload");
const router = express.Router();

router.route("/signup").post(upload.single("logo"), signUp);
router.route("/login").post(companyLogin);
router.route("/").get(protect, restrictTo("admin"), getCompanies);
router.route("/approve/:id").get(protect, restrictTo("admin"), companyApprove);
router.route("/denial/:id").get(protect, restrictTo("admin"), companyDenial);
router.route("/addmember/:userId").get(protectCompany, addMember);
router.route('/paid/:id').get(protect, restrictTo(admin), companyPaid)
router.route('/notpaid/:id').get(protect, restrictTo(admin), companyNotPaid)
router
  .route("/companyuser/signupCompanyAdmin")
  .post(protectCompany, signupCompanyAdmin);
router
  .route("/companyuser/signupEmployee")
  .post(protectCompany, signupEmployee);
router.route("/companyadmin/:userId").get(protectCompany, addCompanyAdmin);

module.exports = router;
