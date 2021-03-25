// imports
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');
const port = 3000;
const ejs = require('ejs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
//database uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}%21@cluster0.fiihw.mongodb.net/test?authSource=admin&replicaSet=atlas-r4sakp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`
// const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}%21@cluster0.fiihw.mongodb.net/test?authSource=admin&replicaSet=atlas-r4sakp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`
const db = new MongoClient(uri, {
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
db.connect();

async function run() {
  try {
    // Connect the client to the server
    await db.connect();
    // Establish and verify connection
    await db.db("plaatsGerecht").command({
      ping: 1
    });

    console.log("Connected succesfully to the database.");
  } finally {
    // Ensures that the client will close when you finish/error
    await db.close();
  }
}
run().catch(console.dir);

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.static('public'));

//route
app.get("/profiles", async (req, res) => {
    MongoClient.connect(uri, async function(err, db) {
    let dbo = db.db('plaatsGerecht');
  // create an empty list of profiles
  let profileData = {};
  // look for profile and show one
  profileData = await dbo
    .collection("profiel")
    .find({}, { sort: { name: 1 } })
    .limit(1)
    .toArray();
  res.render("profile.ejs", {
    title: "Mijn profiel",
    profileData,
    });
  });
});



// Static files
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.static('public/js'));
app.use('/css', express.static('/public/css')); // link naar je css folder
app.use('/js', express.static('/public/js')); // link naar je js folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));


//GET index page
app.get('/', function(req, res, next) {
  res.render('index');
});

// GET login page
app.get('/login', function(req, res, next) {
  res.render('login');
});

// toevoegen pagina
app.get('/toevoegen', async function(req, res, next) {

  MongoClient.connect(uri, async function(err, db) {
    dbo = db.db('plaatsGerecht');
    landen = await dbo.collection('landen').find({}, {
      sort: {
        naam: 1
      }
    }).toArray();
    res.render('add', {
      landen
    });
  });
});
// toevoegen van ingevoerde data van de toevoegpagina!
app.post("/gerechtToegevoegd", (req, res) => {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    let dbo = db.db("plaatsGerecht");

    dbo.collection("gerechten").insertOne({
        afbeelding: req.body.afbeelding,
        titel: req.body.titel,
        ingredienten: req.body.ingredienten,
        tijdsduur: req.body.tijdsduur,
        instructies: req.body.instructies,
        land: req.body.land,
        personen: req.body.personen
      },

      function(err, result) {
        if (err) throw err;
        res.redirect('/'); //Hier wordt je naar toe gestuurd na submit
        db.close();
      })
  });
});


//display alle gerichten + filtermenu
app.get('/thedishes', async (req, res) => {
    MongoClient.connect(uri, async function(err, db) {
    let dbo = db.db("plaatsGerecht");
    const landen = await  dbo.collection('landen').find({}, { sort: {} }).toArray();
    const dish = await dbo.collection('gerechten').find({}, { sort: {} }).toArray(); // data vanuit de database
    res.render('thedishes', { text: '', dish, landen });
   });
});

 //filteren op een bepaald gerecht
app.post('/thedishes', async (req, res) => {
  MongoClient.connect(uri, async function(err, db) {
    let dbo = db.db('plaatsGerecht');

    const dish = await dbo.collection('gerechten').find({
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
  const dish = await db.collection('gerechten').findOne({ id: req.params.dishesId });
  res.render('dishesdetails', { title: 'Clothing Details', dish });
});

//het favorieten van je favoriete gerechten
app.get('/favoritedishes', async (req, res) => {
  const dish = await db.collection('gerechten');
  const favoriteItems = await db.collection('favoriteGerechten');
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
  const favoriteItems = await db.collection('favorieteGerechten');
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


// dynamic room route
app.get('/chat/:id', (req, res) => {
  res.render(req.params.id);
});

// Socket setup & pass server

// var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
      socket.broadcast.emit('typing', data)
    });
});

// page not found
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});
