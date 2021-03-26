// Imports  
const express = require('express');
const ejs = require('ejs');
const port = 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.set('view engine', 'ejs');

// static files 
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use(express.static('public'));


// chatOverview route
app.get('/chat', (req, res) => {
  res.render('chat');
});

// dynamic room route 
app.get('/chat/:id', (req, res) => {
  res.render(req.params.id);
});

// Socket setup & pass server
io.on('connection', (socket) => {
  let roomName = '';
    
    socket.on('join room', (data) => {
      socket.join(data);
      roomName = data;
});

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', (data) => {

        // io.sockets.emit('chat', data);
        socket.to(roomName).emit('chat', data);
});

    

    // function typing...
    socket.on('typing', function(data){
      socket.broadcast.emit('typing', data)
    });
});


// http listen 
http.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

