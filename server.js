console.log('test');

// imports
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');
const port = 3000;
const ejs = require('ejs');


// verbinden met de mongo database
let db = null;
// function connectDB
async function connectDB() {
  // get URI from .env file
  const uri = process.env.DATABASECONNECT;
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options);
  await client.connect();
  db = await client.db(process.env.DATABASENAME);
}

// een 'test' om te achterhalen of de database is verbonden
connectDB()
  .then(() => {
    // if succesfull connections is made, show a message
    console.log('We have a connection to Mongo!');
  })
  .catch((error) => {
    // if connnection is unsuccesful, show errors
    console.log(error);
  });

// dit is waar de applicatie zich bevindt, hij 'luistert op port 3000, daar wordt de app weergegeven
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
app.use(bodyParser.urlencoded({ extended: false }));

let dishes = null;

app.get('/', (req, res) => {
    res.render('index', { text: '' });
});


app.get('/thedishes', async (req, res) => {
    let dishes = {}; 
    dishes = await db.collection('dishes').find({}, { sort: {} }).toArray(); // data vanuit de database
    res.render('thedishes', { text: '', dishes });
 });

app.get('/thedishes/:dishesId', async (req, res) => { 
  const dish = await db.collection('dishes').findOne({ id: req.params.dishesId });
  res.render('dishesdetails', { title: 'Clothing Details', dish });
});

app.get('/', (req, res) => {
    res.render('index', { text: '' });
});


app.get('/favoritedishes', (req, res) => {
    res.render('favoritedishes', { text: '' });
});

app.set('view engine', 'ejs');