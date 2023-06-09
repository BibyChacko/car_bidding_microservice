const AppError = require("../models/app_error");
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

const handleErrors = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorMessage = err.message;
  }
  // Mongoose cast error
  else if (err.name === "CastError") {
    statusCode = 400;
    errorMessage = err.message;
  }
  // Mongoose duplicate key error
  else if (err.name === "MongoError" && err.code === 11000) {
    statusCode = 400;
    errorMessage = "Duplicate key error";
  }
  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorMessage = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorMessage = "Token expired";
  }
  // AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }
  // Other errors
  else {
    statusCode = 500;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    status: false,
    error: errorMessage,
  });

  logger.error(
    JSON.stringify({
      url: req.url,
      method: req.method,
      dateTime : Date.now(),
      statusCode: statusCode,
      errorMessage: errorMessage,
      stacktrace: err.stacktrace,
    })
  );
};

module.exports = handleErrors;
