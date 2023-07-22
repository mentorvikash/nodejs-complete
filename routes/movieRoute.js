const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

const { getMovies, createMovies, getSingleMovies, updateMovies, deleteMovies } =
  movieController;

// router.param("id");

router.route("/").get(getMovies).post(createMovies);
router
  .route("/:id")
  .get(getSingleMovies)
  .patch(updateMovies)
  .delete(deleteMovies);

module.exports = router;
