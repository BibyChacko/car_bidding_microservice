const AppError = require("../models/app_error");

const notFoundHandler = (req, res, next) => {
    return next(new AppError(404,"URL doesn't exists"));
};
  
  module.exports = notFoundHandler;
  