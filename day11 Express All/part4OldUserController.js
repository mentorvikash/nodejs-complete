const fs = require("fs");
const User = require("../models/userModel.js");
const userData = JSON.parse(fs.readFileSync("./data/userData.json", "utf-8"));

exports.checkId = (req, res, next, value) => {
  const user = userData.find((el) => el.id === value * 1);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: `following ${value} is not present` });
  }
  next();
};

// this we create middleware to validate body data
exports.validateBody = (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.email) {
    return res
      .status(404)
      .json({ success: false, message: `not a valid Object` });
  }
  next();
};

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    success: true,
    presentdate: req.presentdate,
    count: userData.length,
    data: { userData },
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const user = userData.find((el) => el.id === id * 1);

  //   if (!user) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: `following ${id} is not present` });
  //   }

  res.status(200).json({ success: true, data: { userData: user } });
};

exports.createUser = (req, res) => {
  const userId = userData[userData.length - 1].id + 1;
  const newUser = Object.assign({ id: userId }, req.body);
  userData.push(newUser);

  fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
    if (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
    res.status(200).json({ success: true, data: { userData: newUser } });
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id * 1;
  const dataToUpdate = userData.find((el) => el.id === id);
  const index = userData.indexOf(dataToUpdate);

  Object.assign(dataToUpdate, req.body);
  (userData[index] = dataToUpdate),
    fs.writeFile("userData.json", JSON.stringify(userData), (err) => {
      if (err) {
        return res.status(404).json({ success: false, message: err.message });
      }
      res.status(200).json({ success: true, data: { userData: dataToUpdate } });
    });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id * 1;
  const finalObjectAfterDelete = userData.filter((el) => el.id !== id);

  fs.writeFile(
    "userData.json",
    JSON.stringify(finalObjectAfterDelete),
    (err) => {
      if (err) {
        return res.status(404).json({ success: false, message: err.message });
      }
      res
        .status(200)
        .json({ success: true, message: "user successfully deleted" });
    }
  );
};
