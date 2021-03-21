const dotenv = require('dotenv').config(); //env files
const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/test', function(req, res, next) {
  res.render('loggedIn');
})

app.get('/login', function(req, res, next) {
  res.render('login');
});
