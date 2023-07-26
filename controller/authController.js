const jwt = require("jsonwebtoken");
const asynErrorHandler = require("./../utils/asynErrorHandler");
const customError = require("./../utils/customError");
const Employee = require("./../models/employeModel");
const util = require("util");

const getToken = (id) => {
  const secretkey = process.env.JWTSECRETKEY;
  const expierTime = Number(process.env.EXPIRETIME);
  return jwt.sign({ id: id }, secretkey, {
    expiresIn: expierTime,
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

  // const isPasswordMatch = await employee.compairpassword(
  //   password,
  //   employee.password
  // );

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
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    const error = new customError("you are not login!", 401);
    next(error);
  }

  // validate the token
  // jwt.verify(token, process.env.JWTSECRETKEY);
  const decodeToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWTSECRETKEY
  );

  //if user exist
  const employee = await Employee.findById(decodeToken.id);
  if (!employee) {
    const err = new customError("User with given token not exist! ", 401);
    next(err);
  }

  // if user change password after token issued
  const ifPasswordChanged = await employee.isPasswordChanged(decodeToken.iat);

  if (ifPasswordChanged) {
    const err = new customError("password changed please login again", 401);
    next(err);
  }
  // allow user to access protected routes
  res.employee = employee;

  next();
});
