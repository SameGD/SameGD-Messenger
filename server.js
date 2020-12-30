const express = require("express");
const app = express();
app.use(express.static("static"));
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const userList = [];
const socketsList = [];
const lastMessages = [];

function updateUserNameList() {
  let userNameList = [];
  
  for (const [key, value] of Object.entries(userList)) {
    userNameList.push(value.name)
  }
  
  io.emit('updateUsers', userNameList);
  
}

function updateLastMessages(msg, user, imag = false) {
  
  if (lastMessages.length == 10) {
    lastMessages.shift();
  }
  
  if (imag == false) {
  
    lastMessages.push("<span class='userName'>" + user + "</span> - " + msg);
    
  } else {
    lastMessages.push("<span class='userName'>" + user + "</span> - <img src='" + msg + "' >");
  }
  
}

io.on("connection", (socket) => {
  
  // Tells the server the identity of the current socket that it's handling
  
  userList[socket.id] = {};
  socketsList[socket.id] = socket;
  
  // Get rid of those who would dare disconnect
  
  socket.on("disconnect", (data) => {
    console.log(userList[socket.id].name + " Left ;(")

    delete userList[socket.id];
    
    updateUserNameList()
  });
  
  // Stores the users name and id upon joining
  
  socket.on("join", (data) => {
    
    userList[socket.id].id = data.id;
    userList[socket.id].name = data.name;
    
    console.log(data.name + " Joined with an ID of " + data.id);
    
    updateUserNameList();
    
    socketsList[socket.id].emit("lastMessages", lastMessages);
    
  });
  
  // Message
  
  socket.on("message", (msg) => {
    updateLastMessages(msg, userList[socket.id].name);
    io.emit("message", "<span class='userName'>" + userList[socket.id].name + "</span> - " + msg);
  });
  
  // Image
  
  socket.on("image", (data) => {
    updateLastMessages(data, userList[socket.id].name, true);
    io.emit("message", "<span class='userName'>" + userList[socket.id].name + "</span> - <img src='" + data + "' >");
  });
  
  
});

http.listen(process.env.PORT || 80);