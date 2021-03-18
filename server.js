const express = require("express");
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
require('dotenv').config();
const expressSession = require('express-session');
const ejs = require('ejs');
const app = express();
const port = process.env.PORT;

// Generates hash using bCrypt
const createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 }

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0u7k.mongodb.net/Cluster0?retryWrites=true&w=majority`
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, dbName:process.env.DB_NAME});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.listen(port, () => console.log(
  `Example app listening on port ${port}!`
));

// if statement soonTM to make sure it only redirects if not logged in
app.get("/", (req, res)=>{
    res.redirect('/login');
    console.log('not logged in');
});

app.get("/login", (req, res)=>{
  res.render('login');
});

app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
}));

app.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/',
}));

app.get('/signup', function(req, res){
  res.render('register',);
});

// when error hapens render the error page
app.use(function (req, res){
  res.status(404).render('error'); 
  res.status(500).render('error'); 
});

passport.use('signup', new LocalStrategy({
  passReqToCallback : true
},
function(req, username, password, done) {
  findOrCreateUser = function(){
    // find a user in Mongo with provided username
    User.findOne({'username':username},function(err, user) {
      // In case of any error return
      if (err){
        console.log('Error in SignUp: '+err);
        return done(err);
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return done(null, false, 
           req.flash('message','User Already Exists'));
      } else {
        // if there is no user with that email
        // create the user
        const newCreatedUser = new User();
        // set the user's local credentials
        newCreatedUser.username = username;
        newCreatedUser.password = createHash(password);
        newCreatedUser.email = req.param('email');
        newCreatedUser.name = req.param('name');

        // save the user
        newUser.save(function(err) {
          if (err){
            console.log('Error in Saving user: '+err);  
            throw err;  
          }
          console.log('User Registration succesful');    
          return done(null, newUser);
        });
      }
    });
  };
   
  // Delay the execution of findOrCreateUser and execute 
  // the method in the next tick of the event loop
  process.nextTick(findOrCreateUser);
}));