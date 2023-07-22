const app = require("./app.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.MONGODB_LOCAL)
  .then((data) => {
    console.log("connecting to Mongoose");
  })
  .catch((err) => {
    console.error("error connecting to Mongoose");
  });

app.listen(port, () => {
  console.log("server listening on " + port);
});

// console.log(app.get("env"));
// console.log(process.env);

// Set Environment with command line
// SET NODE_ENV = development
// SET X = 100
// SET Y = 200
