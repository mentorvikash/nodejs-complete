const asynErrorHandler = require("./../utils/asynErrorHandler");
const People = require("./../models/employeModel");

exports.signUp = asynErrorHandler(async (req, res, next) => {
  const newEmployee = await People.create(req.body);
  return res.status(200).json({ status: "pass", data: { user: newEmployee } });
});

exports.getAllEmployee = asynErrorHandler(async (req, res, next) => {
  const allEmployee = await People.find();
  return res
    .status(200)
    .json({ status: "pass", data: { employee: allEmployee } });
});
