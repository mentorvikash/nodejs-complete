const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
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
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

// const demo = {
//   title: "",
//   description: "",
//   actor: {
//     mainActor: "",
//     coActors: "",
//   },
//   rating: "",
// };

const obj = {
  name: "Riddick",
  description:
    "Left for dead on a sun-scorched planet, Riddick finds himself up against an alien race of predators",
  rating: 6.8,
  duration: 119,
  totalRating: 329,
  releaseYear: 2013,
  releaseDate: "2013-09-04T00:00:00Z",
  genres: ["Action", "Sci-Fi", "Thriller"],
  directors: ["David Twohy"],
  coverImage: "Riddick-2013.jpg",
  actors: ["Vin Diesel", "Karl Urban", "Katee Sackhoff"],
  price: 50,
};
