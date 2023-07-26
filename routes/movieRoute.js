const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");
const authController = require("../controller/authController");

const {
  getMovies,
  createMovies,
  getSingleMovies,
  updateMovies,
  deleteMovies,
  top5movie,
  getMovieStats,
  getMovieByGenres,
} = movieController;

const { protect, restrictUsrs } = authController;

// router.param("id");

router.route("/get-movie-by-genres/:genres").get(getMovieByGenres);
router.route("/getstats").get(getMovieStats);
router.route("/top5movies").get(top5movie, getMovies);
router.route("/").get(protect, getMovies).post(createMovies);
router
  .route("/:id")
  .get(protect, getSingleMovies)
  .patch(updateMovies)
  .delete(protect, restrictUsrs, deleteMovies);

module.exports = router;
