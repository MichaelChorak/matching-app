console.log('test');

// imports
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = 3000;
const ejs = require('ejs');

// Listen on port
app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});
