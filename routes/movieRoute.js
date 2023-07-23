const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

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

// router.param("id");

router.route("/get-movie-by-genres/:genres").get(getMovieByGenres);
router.route("/getstats").get(getMovieStats);
router.route("/top5movies").get(top5movie, getMovies);
router.route("/").get(getMovies).post(createMovies);
router
  .route("/:id")
  .get(getSingleMovies)
  .patch(updateMovies)
  .delete(deleteMovies);

module.exports = router;
