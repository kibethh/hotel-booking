class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const location = this.queryStr.location
      ? {
          address: {
            $regex: this.queryStr.location,
            $options: "i",
          },
        }
      : {};
    console.log(location);
    this.query = this.query.find({ ...location });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["location", "page", "limit"];

    removeFields.forEach((el) => delete queryCopy[el]);

    this.query = this.query.find({ ...queryCopy });
    return this;
  }
  pagination() {
    console.log("querystr", this.queryStr);
    const currentPage = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 3;
    const skip = Number(currentPage - 1) * limit;
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

export default APIFeatures;
