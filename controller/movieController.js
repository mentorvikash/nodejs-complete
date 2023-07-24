const Movie = require("../models/movieModel");
const ApiFeatures = require("./../utils/apiFeatures");
const asynErrorHandler = require("./../utils/asynErrorHandler");
const CustomError = require("./../utils/customError");

exports.top5movie = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-rating";
  next();
};

// function asynErrorHandler(func) {
//   return (req, res, next) => {
//     func(req, res, next).catch((err) => next(err));
//   };
// }

exports.getMovieByGenres = asynErrorHandler(async (req, res, next) => {
  const genres = req.params.genres;
  const moviebyGenres = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        count: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    { $sort: { count: -1 } },
    // { $limit: 2 },
    { $match: { count: { $gt: 2 } } },
    { $addFields: { genres: "$_id" } },
    { $project: { _id: 0 } },
    { $match: { genres: genres } },
  ]);
  res.status(200).json({
    success: true,
    count: moviebyGenres.length,
    data: { moviebyGenres },
  });
});

exports.getMovieStats = asynErrorHandler(async (req, res, next) => {
  const movieStats = await Movie.aggregate([
    { $match: { rating: { $gte: 5.5 } } },
    {
      $group: {
        // _id: null, // id value to null if group all documents
        _id: "$releaseYear", // group data by some specific field
        averageRating: { $avg: "$rating" },
        averagePrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    { $match: { minPrice: { $gte: 55 } } },
  ]);

  return res.status(200).json({
    success: true,
    count: movieStats.length,
    data: {
      stats: movieStats,
    },
  });
});

exports.getMovies = asynErrorHandler(async (req, res, next) => {
  const moviesInstance = new ApiFeatures(Movie.find(), req.query)
    .sort()
    .filter()
    .limitField()
    .pagination();

  const allmovies = await moviesInstance.queryModel;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  if (req.query.page) {
    const movieCount = await Movie.countDocuments();
    if (skip >= movieCount) {
      throw new Error("No more data exist");
    }
  }

  return res
    .status(200)
    .json({ success: true, count: allmovies.length, data: { allmovies } });
});

exports.getSingleMovies = asynErrorHandler(async (req, res, next) => {
  // const singlemovies = await Movie.find({_id: req.params.id});
  const movieData = await Movie.findById(req.params.id);

  if (!movieData) {
    const error = new CustomError("no data found for this id", 404);
    return next(error);
  }

  return res.status(200).json({ success: true, data: { movieData } });
});

exports.createMovies = asynErrorHandler(async (req, res) => {
  const newMovies = await Movie.create(req.body);
  res.status(200).json({ success: true, data: { newMovies } });
});

exports.updateMovies = asynErrorHandler(async (req, res) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    const error = new CustomError("no data found for this id", 404);
    return next(error);
  }

  // const updatedMovie = await Movie.updateOne({ _id: id }, req.body);
  res.status(200).json({ success: true, data: { updatedMovie } });
});

exports.deleteMovies = asynErrorHandler(async (req, res) => {
  const { id } = req.params;
  const deletdMovie = await Movie.deleteOne({ _id: id });

  if (!deletdMovie) {
    const error = new CustomError("no data found for this id", 404);
    return next(error);
  }

  res
    .status(200)
    .json({ success: true, message: "movie successfully deleted" });
});
