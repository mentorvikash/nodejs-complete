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

const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllUsers).post(validateBody, createUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
