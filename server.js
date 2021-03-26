// imports
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');
const port = 3000;
const ejs = require('ejs');
const uri = process.env.DATABASECONNECT;



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
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { text: '' });
});

//display alle gerichten + filtermenu
app.get('/thedishes', async (req, res) => {
    const dish = await db.collection('dish').find({}, { sort: {} }).toArray(); // data vanuit de database
    res.render('thedishes', { text: '', dish });
 });
 

 //filteren op een bepaald gerecht
app.post('/thedishes', async (req, res) => {
  MongoClient.connect(uri, async function(err, db) {
    let dbo = db.db('foodzen');
   
    const dish = await dbo.collection('dish').find({
    dish: req.body.dishes,
    persons: Number(req.body.persons),
    }).toArray()
   
   
   
    console.log(dish);
    console.log(req.body.dishes);
    console.log(typeof req.body.persons);
    res.render('thedishesresults', {dish });
  });
});

//Detailspagina per gerecht
app.get('/thedishes/:dishesId', async (req, res) => {
  const dish = await db.collection('dish').findOne({ id: req.params.dishesId });
  res.render('dishesdetails', { title: 'Clothing Details', dish });
});

//het favorieten van je favoriete gerechten
app.get('/favoritedishes', async (req, res) => {
  const dish = await db.collection('dish');
  const favoriteItems = await db.collection('favoriteItems');
  const objectID = new ObjectID('6059c82d95c0cc12b13d3f7b');


  favoriteItems.findOne({ _id: objectID }, (err, favoriteItemsObject) => { // object id die nu in saveditems staat controleren
    if (err) {
      console.log(err);
    } else {
      dish
        .find({ _id: { $in: favoriteItemsObject.saves } })
        .toArray((err, savedDishes ) => {
          if (err) {
            console.log(err);
          } else {
 
            res.render('favoritedishes', {
              title: 'Favorite Dishes',
              savedDishes,
            });
          }
        });
    }
  });
});


//aangeklikte gerechten opslaan op de database om dan weer te geven op de favoriten pagina
app.post('/favoritedishes', async (req, res) => {
  const dish = await db.collection('dish');
  const favoriteItems = await db.collection('favoriteItems');
  const objectID = new ObjectID('6059c82d95c0cc12b13d3f7b');
  console.log(objectID);
  const options = { upsert: true };
  const savedDish = new ObjectID(req.body.saveit);

  await favoriteItems.updateOne(
    { _id: objectID },
    { $push: { saves: savedDish } }, options
  );

  //controleren
  favoriteItems.findOne({ _id: objectID }, (err, favoriteItemsObject) => { // object id die nu in saveditems staat controleren
    if (err) {
      console.log(err);
    } else {
      dish
        .find({ _id: { $in: favoriteItemsObject.saves } })
        .toArray((err, savedDishes) => {
          if (err) {
            console.log(err);
          } else {
            console.log(savedDishes);
 
            res.render('favoritedishes', {
              title: 'Favorite Dishes',
              savedDishes,
            });
          }
        });
    }
  });
});

app.set('view engine', 'ejs');

 // const isAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/');
// }






// router.get('/home', isAuthenticated, function(req, res){
//   res.render('home', { user: req.user });
//   });

