const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("server listening on " + port);
});

// console.log(app.get("env"));
// console.log(process.env);

// Set Environment with command line
// SET NODE_ENV = development
// SET X = 100
// SET Y = 200
