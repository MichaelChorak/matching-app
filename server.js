// Imports  
const express = require('express');
const ejs = require('ejs');
const port = 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// const isAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/');
// }

app.set('view engine', 'ejs');

// static files 
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use(express.static('public'));


// basic route 
app.get('/', (req, res) => {
  res.render('index');
});

// dynamic room route 
app.get('/chat/:id', (req, res) => {
  res.render(req.params);
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




// router.get('/home', isAuthenticated, function(req, res){
//   res.render('home', { user: req.user });
//   });

http.listen(3000, () => {
  console.log('listening on *:3000');
});

