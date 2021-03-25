const express = require("express");
const ejs = require("ejs");
//init app
const app = express();
const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = 3000;
var bodyParser = require('body-parser');

// test db
console.log(process.env.TESTVAR);

let db = null;
// function connectDB
async function connectDB() {
  // get URL from .env file
  const uri = process.env.DB_URI;
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options);
  await client.connect();
  db = await client.db(process.env.DB_NAME);
}
connectDB()
  .then(() => {
    // if succesfull connections is made, show a message
    console.log("We have a connection to Mongo!");
  })
  .catch((error) => {
    // if connnection is unsuccesful, show errors
    console.log(error);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//route
app.get("/profiles", async (req, res) => {
  // create an empty list of profiles
  let profileData = {};
  // look for profile and show one
  profileData = await db
    .collection("profile")
    .find({}, { sort: { name: 1 } })
    .limit(1)
    .toArray();
  res.render("profile.ejs", {
    title: "My profile",
    profileData,
  });
});

// page not found
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});