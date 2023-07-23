const Movie = require("../models/movieModel");

exports.top5movie = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-rating";
  next();
};

exports.getMovies = async (req, res) => {
  try {
    // stage 1
    // const allmovies = await Movie.find();

    // stage 2
    // Query => ?duration=121&rating=5.5
    // const allmovies = await Movie.find({
    //   duration: +req.query.duration,
    //   rating: req.query.rating,
    // });

    // internal Method (if not pass parameter not respond any data)
    // const allmovies = await Movie.find()
    //   .where({ duration: +req.query.duration })
    //   .where({ rating: req.query.rating });

    // stage 3
    // const allmovies = await Movie.find(req.query);

    // state 4 if pass more query parameters which does not exist
    // Query => ?duration=121&rating=5.5&sort=-1&page=1

    const excludeFileds = ["sort", "page", "limit", "fields", "skip"];
    const newQuery = { ...req.query };

    excludeFileds.forEach((el) => {
      if (newQuery.hasOwnProperty(el)) {
        delete newQuery[el];
      }
    });

    // const allmovies = await Movie.find(newQuery);

    // Stage 5
    // implementing range filter
    // const allmovies = await Movie.find().find({
    //   duration: { $gte: +req.query.duration },
    //   rating: { $gte: +req.query.rating },
    // });

    // We can also use interal mongooose internal methods (not work if field missing)
    // const allmovies = await Movie.find()
    //   .where("duration")
    //   .gte(+req.query.duration)
    //   .where("rating")
    //   .gte(+req.query.rating);

    // adding doller sign to gt lt lte and gte query string
    let queryString = JSON.stringify(newQuery);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`
    );
    const queryObject = JSON.parse(queryString);

    // Stage 6
    // Query => ?sort=-releaseYear,duration
    let query = Movie.find(queryObject);

    // Sorting Logic
    if (req.query.sort) {
      const sortString = req.query.sort.split(",").join(" ");
      console.log(sortString);
      query = query.sort(sortString);
    } else {
      query = query.sort({ createdAt: 1 });
    }

    // Selected limited fields (Progection in mongodb)
    // Query => ?fields=name,description,rating
    // Query => ?fields=-name,-description

    if (req.query.fields) {
      const fieldString = req.query.fields.split(",").join(" ");
      query = query.select(fieldString);
    } else {
      query = query.select("-__v");
    }

    // Pagination when user send then page and limit as query string
    // Query => ?page=5&limit=3

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const movieCount = await Movie.countDocuments();
      if (skip >= movieCount) {
        throw new Error("No more data exist");
      }
    }

    const allmovies = await query;

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
