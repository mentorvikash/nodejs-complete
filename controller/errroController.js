const customErrror = require("./../utils/customError");

const castErrorHandler = (error) => {
  const mgs = `invalid ${error.name} for ${error.path} field! `;
  return new customErrror(mgs, 400);
};

const dublicateErrorHandler = (error) => {
  const movieName = error.keyValue.title;
  const mgs = `the movie name ${movieName} is duplicate, please select something unique`;
  return new customErrror(mgs, 400);
};

const handleValidationError = (error) => {
  const errorArr = Object.values(error.errors).map((el) => el.message);
  const msg = errorArr.join(". ");
  return new customErrror(msg, 400);
};

const handleExpiredJwt = (error) => {
  return new customErrror("JWT as expired please login again", 401);
};

const handleJwtError = (error) => {
  return new customErrror("Invalid token please login again", 401);
};

const developmentErr = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrack: error.stack,
    error: error,
  });
};

const productionErr = (res, error, next) => {
  if (error.isOperationError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    res.status(500).json({
      status: "error",
      message: "somthing went wrong please try again later!",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    developmentErr(res, error);
  }

  if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = dublicateErrorHandler(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationError(error);
    }
    if (error.name === "TokenExpiredError") {
      error = handleExpiredJwt(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJwtError(error);
    }
    return productionErr(res, error);
  }
};
