const express = require("express");
const morgan = require("morgan");
let app = express();
const userRouter = require("./routes/userRoute");

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

app.use("/api/user", userRouter);

module.exports = app;
