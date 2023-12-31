const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

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
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
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
  forgetPasswordToken: {
    type: String,
  },
  forgetPasswordTokenExpireTime: {
    type: Date,
  },
  passwordChangedAt: Date,
});

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // encrypt the password before saving
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

employeeSchema.methods.compairpassword = async function (pass, passDB) {
  return await bcrypt.compare(pass, passDB);
};

employeeSchema.methods.isPasswordChanged = async function (jwttimestamp) {
  if (this.passwordChangedAt) {
    // convert time in milliseconds to convet to seconds and change to base 10 integer
    const passWordCreatedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passWordCreatedTimeStamp > jwttimestamp;
  }
  return false;
};

employeeSchema.methods.createForgetPasswordToken = async function () {
  const randomToken = crypto.randomBytes(32).toString("hex");
  this.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(randomToken)
    .digest("hex");

  this.forgetPasswordTokenExpireTime = Date.now() + 10 * 60 * 1000;
  return randomToken;
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

// const demoEmployee = {
//   name: "vikash singh",
//   email: "vikashxyz@gmail.com",
//   photo: "sxyz.jpg",
//   password: "test@1234",
//   confirmPassword: "test@1234",
// };
