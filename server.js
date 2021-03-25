const express = require("express");
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');
require('dotenv').config();
const expressSession = require('express-session');
const User = require('./models/user');
const ejs = require('ejs');
const flash = require('connect-flash');
const { exec } = require("child_process");
const app = express();
const port = process.env.PORT;

app.use(expressSession({secret: process.env.secretKey, maxAge:3600000 }));
app.use(flash())
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

// Generates hash using bCrypt
const createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 }

 const isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }else{  
    res.redirect('/login');
  }
}

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.listen(port, () => console.log(
  `Matching app listening on port ${port}!`
));

// if statement soonTM to make sure it only redirects if not logged in
app.get('/', isAuthenticated, (req, res)=>{
  res.render('home', { user: req.user });
});
 


app.get('/login', (req, res)=>{
  res.render('login');
});

app.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

passport.use('login', new LocalStrategy({
  passReqToCallback : true,
},
function(req, username, password, done) { 
  User.findOne({ 'username' :  username}, 
    function(err, user) {
      // In case of any error, return using the done method
      if (err)
        return done(err);
      // Username does not exist, log error and redirect
      if (!user){
        console.log('User Not Found with username '+username);
        return done(null, false, 
          console.log('User Not found.'));                 
      }
      // User exists, wrong password, log the error 
      if (!isValidPassword(user, password)){
        console.log('Invalid Password');
        return done(null, false, 
          console.log('Invalid Password'));
      }
      // User & password  match, return user 
      console.log('user exists and login is succeeded!')
      return done(null, user);
    }
  );
}));


app.get('/signup', function(req, res){
  res.render('register',);
});

app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true
}));

passport.use('signup', new LocalStrategy({
  passReqToCallback : true
},
function(req, username, password, done) {
  findOrCreateUser = function(){
    console.log('reached findorcreate!');
    // find a user in the db with the provided username
    User.findOne({'username':username},function(err, user) {
      // In case of any error return the following
      if (err){
        console.log('Error in SignUp: '+err);
        return done(err);
      }
      // already exists?
      if (user) {
        console.log('User already exists');
        return done(null, false, 
          console.log('User Already Exists'));
      } else {
        // if there is no user with that email, create them
        const newCreatedUser = new User();
        // set the user's local credentials
        newCreatedUser.username = req.body.username;
        newCreatedUser.password = createHash(req.body.password);
        newCreatedUser.email = req.body.email;
        newCreatedUser.name = req.body.name;
        
        // save the user
        newCreatedUser.save(function(err) {
          if (err){
            console.log('Error in Saving user: '+err);  
            return;  
          }
          console.log('User Registration succesful');    
          return done(null, newCreatedUser);
        });
      }
    });
  };
   
  // Delay the execution of findOrCreateUser and execute 
  // the method in the next tick of the event loop
  process.nextTick(findOrCreateUser);
}));


// if someone tries going to the 'signout' url they will be signed out, logout is passport middleware, straight out of documentation
app.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// when error hapens render the error page
app.use(function (req, res){
  res.status(404).render('error'); 
});
