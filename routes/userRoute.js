const express = require("express");
const UserController = require("../controller/userController");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  checkId,
  validateBody,
} = UserController;

const route = express.Router();

route.param("id", checkId);

route.route("/").get(getAllUsers).post(validateBody, createUser);

route.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = route;
