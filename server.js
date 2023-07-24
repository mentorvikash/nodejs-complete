const app = require("./app.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (error) => {
  console.log(`${error.name} : ${error.message} `);
  console.log("some uncaughtException happened and shuting down");
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_LOCAL).then((data) => {
  console.log("connecting to Mongoose");
});
// .catch((err) => {
//   console.error("error connecting to Mongoose");
// });

const server = app.listen(port, () => {
  console.log("server listening on " + port);
});

process.on("unhandledRejection", (error) => {
  console.log(`${error.name} : ${error.message} `);
  console.log(" something unhandledRejection occurred and shuting donw");
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);

// uncaughtException => error occer in javascript syncronously

// console.log(app.get("env"));
// console.log(process.env);

// Set Environment with command line
// SET NODE_ENV = development
// SET X = 100
// SET Y = 200
