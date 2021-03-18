const express = require("express");
const app = express();
const ejs = require('ejs');
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

app.listen(port, () => console.log(
  `Example app listening on port ${port}!`
));

// if statement soonTM to make sure it only redirects if not logged in
app.get("/", (req, res)=>{
    res.send('/login');
});

app.get("/login", (req, res)=>{
    res.send('login');
});
