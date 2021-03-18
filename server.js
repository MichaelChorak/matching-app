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

// Static files
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.static('public/js'));
app.use('/css', express.static('/public/css')); // link naar je css folder
app.use('/js', express.static('/public/js')); // link naar je js folder

app.get('/', (req, res) => {
  res.render('index', { text: '' });
});

app.get('/dishes', (req, res) => {
    res.render('dishes', { text: '' });
  });

app.get('/dishes/:dishesId', (req, res) => {
    res.render('dishesdetails', { text: '' });
  });

app.get('/dishesdetails', (req, res) => {
    res.render('dishesdetails', { text: '' });
  });

app.get('/favoritedishes', (req, res) => {
    res.render('favoritedishes', { text: '' });
  });

app.set('view engine', 'ejs');