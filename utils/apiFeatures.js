class ApiFeatures {
  constructor(queryModel, queryString) {
    this.queryModel = queryModel;
    this.queryString = queryString;
  }

  filter() {
    const excludeFileds = ["sort", "page", "limit", "fields", "skip"];
    const newQuery = { ...this.queryString };

    excludeFileds.forEach((el) => {
      if (newQuery.hasOwnProperty(el)) {
        delete newQuery[el];
      }
    });

    let queryString = JSON.stringify(newQuery);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`
    );
    const queryObject = JSON.parse(queryString);

    this.queryModel = this.queryModel.find(queryObject);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortString = this.queryString.sort.split(",").join(" ");
      this.queryModel = this.queryModel.sort(sortString);
    } else {
      this.queryModel = this.queryModel.sort({ createdAt: 1 });
    }
    return this;
  }

  limitField() {
    if (this.queryString.fields) {
      const fieldString = this.queryString.fields.split(",").join(" ");
      this.queryModel = this.queryModel.select(fieldString);
    } else {
      this.queryModel = this.queryModel.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const movieCount = await Movie.countDocuments();
    //   if (skip >= movieCount) {
    //     throw new Error("No more data exist");
    //   }
    // }

    return this;
  }
}

module.exports = ApiFeatures;
