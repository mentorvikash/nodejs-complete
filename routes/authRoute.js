const express = require("express");
const router = express.Router();
const authController = require("./../controller/authController");

const { getAllEmployee, signUp } = authController;

router.route("/signup").post(signUp);
router.route("/all-employee").get(getAllEmployee);

module.exports = router;
