function config (app) {

    const express = require("express");
    const logger = require("morgan");
    const cors = require("cors");
    // MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
    cors({
      // Add the URLs of allowed origins to this array
      origin: ['http://localhost:5173'],
    })
  );
  
  app.use(express.json());
  app.use(logger("dev"));
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: false }));
}

module.exports = config