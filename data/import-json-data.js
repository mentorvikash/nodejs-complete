const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Movie = require("../models/movieModel");

dotenv.config({ path: "../config.env" });

mongoose
  .connect(process.env.MONGODB_LOCAL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database connection established");
  })
  .catch((error) => {
    console.log("something went wrong with mongodb " + error.message);
  });

const moviesData = JSON.parse(fs.readFileSync("./demoMovie.json", "utf8"));

const importMovie = async () => {
  try {
    await Movie.insertMany(moviesData);
    console.log("movies successfully imported");
  } catch (error) {
    console.log("error : " + error.message);
  }
  process.exit();
};

const deleteMovie = async () => {
  try {
    await Movie.deleteMany();
    console.log("movies successfully deleted");
  } catch (error) {
    console.log("error : " + error.message);
  }
  process.exit();
};

console.log(process.argv[2]);

if (process.argv[2] === "--import") {
  importMovie();
}

if (process.argv[2] === "--delete") {
  console.log("i am in delete block");
  deleteMovie();
  //   process.exit();
}
