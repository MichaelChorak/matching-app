// Make connection
 socket = io.connect('http://localhost:3000');

// Query DOM
const message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', () => {
  socket.emit('chat',  {
      message: message.value,
      handle: handle.value
  });
  message.value = "";
});

// typing... event
message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
})

// message to enter event
message.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    socket.emit('chat', {
      message: message.value,
      handle: handle.value
    });
    message.value = "";
  }
})

// Listen for events
socket.on('chat', (data) => {
    feedback.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', (data) => {
  feedback.innerHTML = '<p><em>' +data + ' is typing a message... </em></p>';
})