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
    // Other errors
    else {
      console.error(err);
    }
  
    res.status(statusCode).json({
      status: false,
      error: errorMessage,
    });
    next();
  };
  
  module.exports = handleErrors;
  