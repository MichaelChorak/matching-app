// Make connection
socket = io.connect(window.location.host);

// Query DOM
const message = document.getElementById("message"),
  handle = document.getElementById("handle"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  feedback = document.getElementById("feedback");


document.addEventListener("DOMContentLoaded", () => {
  socket.emit("join room", window.location.pathname);
});

// Emit events
btn.addEventListener("click", () => {
  sendMessage();
});



// typing... event
message.addEventListener("keypress", () => {
  socket.emit("typing", handle.value);
});

// message to enter event
message.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    sendMessage();
  }
});

// Listen for events
socket.on("chat", (data) => {
  feedback.innerHTML = "";
  output.innerHTML += "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});

socket.on("typing", (data) => {
  feedback.innerHTML = "<p><em>" + data + " is typing a message... </em></p>";
});

function sendMessage() {
  if (message.value.trim() == "" || handle.value.trim() == "") {
    return;
  }
  const handleFormat = handle.value.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const messageFormat = message.value.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");



  socket.emit("chat", {
    message: messageFormat,
    handle: handleFormat
  });
  output.innerHTML += "<p><strong>" + handleFormat + ": </strong>" + messageFormat + "</p>";
  message.value = "";
}
