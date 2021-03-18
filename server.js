const express = require("express");
const ejs = require("ejs"); 
//init app
const app = express();
const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = 3000;

// page not found
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });
  
  // start server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });