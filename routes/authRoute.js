const express = require("express");
const router = express.Router();
const authController = require("./../controller/authController");

const { getAllEmployee, signUp, signIn, forgetPassword, resetforgetPassword } =
  authController;

router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
router.route("/foget-password").post(forgetPassword);
router.route("/reset-forget-password").post(resetforgetPassword);
router.route("/all-employee").get(getAllEmployee);

module.exports = router;
