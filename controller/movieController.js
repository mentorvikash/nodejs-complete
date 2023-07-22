const Movie = require("../models/movieModel");

exports.getMovies = async (req, res) => {
  try {
    const allmovies = await Movie.find();
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
