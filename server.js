const express = require('express');
const port = 3000;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('index');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});