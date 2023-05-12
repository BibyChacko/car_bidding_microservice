const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

function essentialMiddleware(app) {
  console.log("Essential middlewares called");
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
}

module.exports = essentialMiddleware;