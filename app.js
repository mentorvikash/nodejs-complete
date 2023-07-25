const express = require("express");
const morgan = require("morgan");
let app = express();
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const curtomError = require("./utils/customError");
const globalErrorHandler = require("./controller/errroController");

// middleware
if (process.env.NODE_ENV !== "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static("./public"));
app.use((req, res, next) => {
  req.presentdate = new Date();
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);
app.all("*", (req, res, next) => {
  // return res.status(404).json({
  //   success: false,
  //   message: `this ${req.originalUrl} is not available `,
  // });

  // const err = new Error(`this ${req.originalUrl} is not available`);
  // err.status = "fail";
  // err.statusCode = 404;
  const err = new curtomError(`this ${req.originalUrl} is not available`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
