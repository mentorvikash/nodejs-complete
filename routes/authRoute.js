const express = require("express");
const router = express.Router();
const authController = require("./../controller/authController");

const { getAllEmployee, signUp, signIn } = authController;

router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
router.route("/all-employee").get(getAllEmployee);

module.exports = router;
