const express = require("express");
const app = express();
const ejs = require('ejs');
const port = 3000;

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0u7k.mongodb.net/Cluster0?retryWrites=true&w=majority`
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, dbName:process.env.DB_NAME});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

app.listen(port, () => console.log(
  `Example app listening on port ${port}!`
));

// if statement soonTM to make sure it only redirects if not logged in
app.get("/", (req, res)=>{
    res.redirect('/login');
});

app.get("/login", (req, res)=>{
  res.sendFile(__dirname + '/views/login.html');
});
