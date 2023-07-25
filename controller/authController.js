const jwt = require("jsonwebtoken");
const asynErrorHandler = require("./../utils/asynErrorHandler");
const customError = require("./../utils/customError");
const Employee = require("./../models/employeModel");

const getToken = (id) => {
  const secretkey = process.env.JWTSECRETKEY;

  return jwt.sign({ id: id }, secretkey, {
    expiresIn: process.env.EXPIRETIME,
  });
};

exports.signUp = asynErrorHandler(async (req, res, next) => {
  const newEmployee = await Employee.create(req.body);
  // let token = jwt.sign({ id: newEmployee._id }, secretkey, {
  //   expiresIn: process.env.EXPIRETIME,
  // });
  let token = getToken(newEmployee._id);

  return res
    .status(200)
    .json({ status: "pass", token, data: { user: newEmployee } });
});

exports.signIn = asynErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    const err = new customError("email and password is not present", 400);
    return next(err);
  }

  // check if user exist for given email
  const employee = await Employee.findOne({ email }).select("+password");

  const isPasswordMatch = await employee.compairpassword(
    password,
    employee.password
  );

  if (
    !employee ||
    !(await employee.compairpassword(password, employee.password))
  ) {
    const err = new customError("Incorrect email or password", 400);
    return next(err);
  }

  let token = getToken(employee._id);

  return res.status(200).json({ status: "pass", token, data: {} });
});

exports.getAllEmployee = asynErrorHandler(async (req, res, next) => {
  const allEmployee = await Employee.find();
  return res
    .status(200)
    .json({ status: "pass", data: { employee: allEmployee } });
});

exports.protect = asynErrorHandler(async (req, res, next) => {
  // read the token to check if existi
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startWith("Bearer")) {
    const token = testToken.split(" ")[1];
  }
  console.lo("you are in protect routes");
  // validate the token
  //if user exist
  // if user change password after token issued
  // allow user to access protected routes
  next();
});
