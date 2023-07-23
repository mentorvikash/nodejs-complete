const mongoose = require("mongoose");
const fs = require("fs");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      default: null,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    rating: {
      type: Number,
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release Year is required"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // use when don't want to show some field in response
    },
    genres: {
      type: [String],
      required: [true, "genres are required"],
    },
    directors: {
      type: [String],
      required: [true, "genres are required"],
    },
    coverImage: {
      type: [String],
      required: [true, " cover image is required"],
    },
    actors: {
      type: [String],
      required: [true, " actors are required"],
    },
    price: {
      type: Number,
      required: [true, " price is required"],
    },
    movieDirector: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

// EXECUTE BEFORE SAVE
// work after save or create
// not work with insertMany or update
movieSchema.pre("save", function (next) {
  this.movieDirector = "revive coding";
  next();
});

// EXECUTE AFTER SAVE
movieSchema.post("save", function (doc, next) {
  const content = `A new movie with tilte ${doc.name} is added createdJhakash movie by ${doc.movieDirector}\n`;
  fs.writeFileSync(
    "./data/movieLogs.txt",
    content,
    { flag: "a" },
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  next();
});

// pre middlewares for all find methods
movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

// post middlewares for all find methods
movieSchema.post(/^find/, function (doc, next) {
  this.endTime = Date.now();
  const content = `a new movie search performance took ${
    this.endTime - this.startTime
  } miliseconds\n`;
  fs.writeFileSync(
    "./data/movieLogs.txt",
    content,
    { flag: "a" },
    function (err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
  next();
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

// NOTE: We can't derectly make query to virtual properties
// mongoose middleware - post and pre hook => movieSchema.pre() or movieSchema.post()

// const demo = {
//   title: "",
//   description: "",
//   actor: {
//     mainActor: "",
//     coActors: "",
//   },
//   rating: "",
// };

// const obj = {
//   name: "Riddick",
//   description:
//     "Left for dead on a sun-scorched planet, Riddick finds himself up against an alien race of predators",
//   rating: 6.8,
//   duration: 119,
//   totalRating: 329,
//   releaseYear: 2013,
//   releaseDate: "2013-09-04T00:00:00Z",
//   genres: ["Action", "Sci-Fi", "Thriller"],
//   directors: ["David Twohy"],
//   coverImage: "Riddick-2013.jpg",
//   actors: ["Vin Diesel", "Karl Urban", "Katee Sackhoff"],
//   price: 50,
// };
