const dotenv = require('dotenv').config(); //env files
const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');


//database uri
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}%21@cluster0.fiihw.mongodb.net/test?authSource=admin&replicaSet=atlas-r4sakp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`
const db = new MongoClient(uri, { useUnifiedTopology: true });
app.use(bodyParser.urlencoded({  extended: true  }));
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

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index');
});

// if logged in = succesfully, this will be the redirection page
app.get('/loginTrue', function(req, res, next) {
  res.render('loggedIn');
});

// GET login page
app.get('/login', function(req, res, next) {
  res.render('login');
});


// toevoegen pagina
app.get('/toevoegen', function (req, res, next) {
  res.render('add');
});



app.post("/gerechtToegevoegd", (req, res) => {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    let dbo = db.db("plaatsGerecht");
    dbo.collection("gerechten").insertOne({
        afbeelding: req.body.afbeelding,
        titel: req.body.titel,
        ingredienten: req.body.ingredienten,
        tijdsduur: req.body.tijdsduur,
        instructies: req.body.instructies

      },
      function(err, result) {
        if (err) throw err;
        res.redirect('/'); //Hier wordt je naar toe gestuurd na submit
        db.close();
      });
  });
});
