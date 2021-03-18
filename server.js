const express = require("express");
const app = express();
const pug = require('ejs');
const port = 3000;

app.listen(port, () => console.log(
  `Example app listening on port ${port}!`
));

// if statement soonTM to make sure it only redirects if not logged in
app.get("/", (req, res)=>{
    res.redirect('/login')
});

app.get("/login", (req, res)=>{
    res.render('login');
});
