// Error
// Operation Error (Exception)
// Programing Error

// Global Error Handler Middleware

// Old CODE without Global Error Handler

const { json } = require("express");
const Movie = require("../models/movieModel");
const ApiFeatures = require("./../utils/apiFeatures");

exports.top5movie = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-rating";
  next();
};

exports.getMovieByGenres = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

exports.getSingleMovies = async (req, res) => {
  try {
    // const singlemovies = await Movie.find({_id: req.params.id});
    const movieData = await Movie.findById(req.params.id);

    return res.status(200).json({ success: true, data: { movieData } });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

exports.createMovies = async (req, res) => {
  console.log(req.body);

  try {
    const newMovies = await Movie.create(req.body);
    res.status(200).json({ success: true, data: { newMovies } });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateMovies = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    // const updatedMovie = await Movie.updateOne({ _id: id }, req.body);

    res.status(200).json({ success: true, data: { updatedMovie } });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.deleteMovies = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.deleteOne({ _id: id });
    res
      .status(200)
      .json({ success: true, message: "movie successfully deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
