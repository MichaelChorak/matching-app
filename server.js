// imports
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const {
  MongoClient,
  ObjectID
} = require("mongodb");
const port = process.env.PORT;
const ejs = require("ejs");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const expressSession = require("express-session");
const User = require("./models/user");
const flash = require("connect-flash");
const {
  exec
} = require("child_process");
const nodemailer = require("nodemailer");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());


app.set("view engine", "ejs");

/* error handling*/
// calling the error file
const { handleError, ErrorHandler } = require("./handlingError/error");

// error handling testen
app.get("/error", (req, res) => {
  throw new ErrorHandler(500, "not working !");
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

// static files
app.use(expressSession({
  secret: process.env.secretKey,
  maxAge: 3600000
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static("public"));
app.use(express.static("public/images"));
app.use(express.static("public/js"));
app.use("/css", express.static("/public/css")); // link naar je css folder
app.use("/js", express.static("/public/js")); // link naar je js folder
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.static("public"));
app.use(express.json());

//database uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}%21@cluster0.fiihw.mongodb.net/test?authSource=admin&replicaSet=atlas-r4sakp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
const db = new MongoClient(uri, {
  useUnifiedTopology: true
});
db.connect();

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME
});
const dbMongoose = mongoose.connection;
dbMongoose.on("error", console.error.bind(console, "connection error:"));

// Hashing and authentication code
// Generates hash using bCrypt
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// http listen
http.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

async function run() {
  try {
    // Connect the client to the server
    await db.connect();
    // Establish and verify connection
    await db.db("foodzen").command({
      ping: 1
    });
    console.log("Connected succesfully to the database.");
  } finally {
    // Ensures that the client will close when you finish/error
    await db.close();
  }
}
run().catch(console.dir);


//route profile
app.get("/profiles", isAuthenticated, async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");

    let descriptionAdd = await
      dbo.collection("descriptionProfile")
        .find({})
        .toArray();

    // create an empty list of profiles
    let profileData = {};

    try {
      // look for profile and show one
      profileData = await dbo
        .collection("profiles")
        .find({ $or: [{ "id": "A3" }] })
        .toArray();
      console.log(profileData);
      res.render("profile.ejs", {
        title: "My Profile",
        profileData,
        descriptionAdd
      });
      console.log("Page are loading, :)");
    } catch (err) {
      console.log(err);
      console.log("error!: something went wronge");
    } finally {
      console.log("Check");
    }
  });
});

/* ----add personal description ----*/
app.post("/profiles/addDescr", isAuthenticated, async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");

    /* show the add description */
    let descriptionAdd = await
      dbo.collection("descriptionProfile")
        .find({})
        .toArray();

    /* add */
    dbo.collection("descriptionProfile")
      .insertOne({
        description: req.body.description
      });

    /* show profile information */
    let profileData = {};
    // look for profile and show one
    try {
      profileData = await dbo
        .collection("profile")
        .find({ $or: [{ "id": "A3" }] })
        .toArray();
      console.log(profileData);
      res.render("profile.ejs", {
        title: "My profile",
        profileData,
        descriptionAdd
      });
      console.log("Page are loading, :)");
    } catch (err) {
      console.log(err);
      console.log("error!: something went wronge");
    } finally {
      console.log("Check");
    }
  });
});

/* ----delete personal description ----*/
app.post("/profiles/delete", isAuthenticated, async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");
    /* show the add description */
    let descriptionAdd = await
      dbo.collection("descriptionProfile")
        .find({})
        .toArray();

    /* delete */
    try {
      db.collection("descriptionProfile")
        .deleteMany({});
    }
    catch (e) {
      console.log(e);
      throw new ErrorHandler("ooh noo, deleting its not working");
    } finally {
      console.log("test, collection delete done");
    }

    /* show profile information */
    let profileData = {};
    // look for profile and show one
    try {
      profileData = await dbo
        .collection("profile")
        .find({ $or: [{ "id": "A3" }] })
        .toArray();
      console.log(profileData);
      res.render("profile.ejs", {
        title: "My profile",
        profileData,
        descriptionAdd
      });
      console.log("Page are loading, :)");
    } catch (err) {
      console.log(err);
      console.log("error!: something went wronge");
    } finally {
      console.log("Check");
    }
  });
});


//GET index page
app.get("/", (req, res) => {
  res.render("index", {
    user: req.user
  });
});

//GET login page
app.get("/login", (req, res) => {
  res.render("login", {
    message: req.flash("message")
  });
});

app.post("/login", passport.authenticate("login", {
  //route after succesfully log in
  successRedirect: "/add",
  failureRedirect: "/login",
  failureFlash: true
}));

passport.use("login", new LocalStrategy({
  passReqToCallback: true,
},
  (req, username, password, done) => {
    User.findOne({
      "username": username
    },
      (err, user) => {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error and redirect
        if (!user) {
          console.log("User Not Found with username " + username);
          return done(null, false,
            req.flash("message", "No user found with the username" + username));
        }
        // User exists, wrong password, log the error
        if (!isValidPassword(user, password)) {
          console.log("Invalid Password");
          return done(null, false,
            req.flash("message", "Invalid password!"));
        }
        // User & password  match, return user
        console.log("user exists and login is succeeded!");
        return done(null, user);
      }
    );
  }));

app.get("/signup", (req, res) => {
  res.render("register", {
    message: req.flash("message")
  });
});

app.post("/signup", passport.authenticate("signup", {
  successRedirect: "/login",
  failureRedirect: "/signup",
  failureFlash: true
}));

passport.use("signup", new LocalStrategy({
  passReqToCallback: true
},
  (req, username, password, done) => {
    findOrCreateUser = () => {
      // find a user in the db with the provided username
      User.findOne({
        "username": username
      }, (err, user) => {
        // In case of any error return the following
        if (err) {
          req.flash("message", "Error in SignUp: " + err);
          return done(err);
        }
        // already exists?
        if (user) {
          console.log("User already exists");
          return done(null, false,
            req.flash("message", "User already exists!"));
        } else {
          // if there is no user with that email, create them
          const newCreatedUser = new User();
          // set the user's local credentials
          newCreatedUser.username = req.body.username;
          newCreatedUser.password = createHash(req.body.password);
          newCreatedUser.email = req.body.email;
          newCreatedUser.name = req.body.name;

          // save the user
          newCreatedUser.save((err) => {
            if (err) {
              req.flash("message", "Error in Saving user: " + err);
              return;
            }
            console.log("User Registration succesful");
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
app.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/sendmail", (req, res) => {

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  //step 2
  let mailOptions = {
    name: req.body.name,
    from: process.env.EMAIL,
    to: req.body.email,
    subject: req.body.subject,
    text: req.body.message
  };

  //step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error occured");
    } else {
      console.log("email sent!");
    }
  });

  res.render("contactConfirm", {
    title: "Email succesfully send",
    mailOptions
  });
});


app.get("/contactConfirm", (req, res) => {
  res.render("contactConfirm");
});


// adding page
app.get("/add", isAuthenticated, async (req, res, next) => {

  MongoClient.connect(uri, async (err, db) => {
    dbo = db.db("foodzen");
    countries = await dbo.collection("countries").find({}, {
      sort: {
        naam: 1
      }
    }).toArray();
    res.render("add", {
      countries
    });
  });
});
// adding filled in information
app.post("/dishAdded", (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    if (err) throw err;
    let dbo = db.db("foodzen");

    dbo.collection("dishes").insertOne({
      image: req.body.image,
      title: req.body.title,
      ingredients: req.body.ingredients,
      duration: req.body.duration,
      instructions: req.body.instructions,
      country: req.body.countries,
      people: req.body.people
    },
      (err, result) => {
        if (err) throw err;
        res.redirect("/"); // sent here after submit
        db.close();
      });
  });
});


// Display all dishes + filtermenu
app.get("/thedishes", isAuthenticated, async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");
    const dish = await dbo.collection("dishes").find({}, {
      sort: {}
    }).toArray(); // data from database
    res.render("thedishes", {
      text: "",
      dish
    });
  });
});

// Filtering a specific dish
app.post("/thedishes", async (req, res) => {
  MongoClient.connect(uri, async function (err, db) {
    let dbo = db.db("foodzen");

    const allDishes = await dbo.collection("dishes").find({
      country: req.body.countries,
      people: req.body.people,
    }).toArray();



    console.log(allDishes);
    console.log(req.body.countries);
    console.log(req.body.people);

    res.render("thedishesresults", {
      allDishes
    });
  });
});

// Detailpage of one single dish
app.get("/thedishes/:dishesTitle", isAuthenticated, async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");
    const dish = await dbo.collection("dishes").findOne({
      title: req.params.dishesTitle
    });
    res.render("dishesdetails", {
      dish
    });
  });
});


// getting your favorite dishes
app.get("/favoritedishes", isAuthenticated, async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");
    const dish = await dbo.collection("dishes");
    const favoriteItems = await dbo.collection("favoriteDishes");
    const objectID = new ObjectID("6059c82d95c0cc12b13d3f7b");


    favoriteItems.findOne({
      _id: objectID
    }, (err, favoriteItemsObject) => { // object id that will check savedDishes
      if (err) {
        console.log(err);
      } else {
        dish
          .find({
            _id: {
              $in: favoriteItemsObject.saves
            }
          })
          .toArray((err, savedDishes) => {
            if (err) {
              console.log(err);
            } else {

              res.render("favoritedishes", {
                title: "Favorite Dishes",
                savedDishes,
              });
            }
          });
      }
    });
  });
});

// saving favorite dishes to show on the favorite page
app.post("/favoritedishes", async (req, res) => {
  MongoClient.connect(uri, async (err, db) => {
    let dbo = db.db("foodzen");
    const dish = await dbo.collection("dishes");
    const favoriteItems = await dbo.collection("favoriteDishes");
    const objectID = new ObjectID("6059c82d95c0cc12b13d3f7b");
    console.log(objectID);
    const savedDish = new ObjectID(req.body.saveit);

    await favoriteItems.updateOne({
      _id: objectID
    }, {
      $push: {
        saves: savedDish
      }
    });

    //Checking
    favoriteItems.findOne({
      _id: objectID
    }, (err, favoriteItemsObject) => { // object id that's in savedDishes checking
      if (err) {
        console.log(err);
      } else {
        dish
          .find({
            _id: {
              $in: favoriteItemsObject.saves
            }
          })
          .toArray((err, savedDishes) => {
            if (err) {
              console.log(err);
            } else {
              console.log(savedDishes);

              res.render("favoritedishes", {
                title: "Favorite Dishes",
                savedDishes,
              });
            }
          });
      }
    });
  });
});

// chatOverview route
app.get("/chat", isAuthenticated, (req, res) => {
  res.render("chat");
});


// dynamic room route
app.get("/chat/:id", isAuthenticated, (req, res) => {
  res.render(req.params.id);
});

// Socket setup & pass server

io.on("connection", (socket) => {

  let roomName = "";

  socket.on("join room", (data) => {

    socket.join(data);

    roomName = data;

  });



  console.log("made socket connection", socket.id);



  // Handle chat event

  socket.on("chat", (data) => {

    // io.sockets.emit('chat', data);

    socket.to(roomName).emit("chat", data);

  });




  // function typing...

  socket.on("typing", function (data) {

    socket.broadcast.emit("typing", data);

  });

});
// page not found
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
