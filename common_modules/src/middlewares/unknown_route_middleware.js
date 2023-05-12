const notFoundHandler = (req, res, next) => {
    res.status(404).json({ status: false, error: "Not found" });
  };
  
  module.exports = notFoundHandler;
  