const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: [validator.isEmail, "email is not a valid email"],
    lowercase: true,
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm password is required"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "password and confirm password not match",
    },
  },
});

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // encrypt the password before saving
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

// const demoEmployee = {
//   name: "vikash singh",
//   email: "vikashxyz@gmail.com",
//   photo: "sxyz.jpg",
//   password: "test@1234",
//   confirmPassword: "test@1234",
// };
