const socket = io.connect(document.documentURI);

// Name Vars

let userName = "";
let userList = document.getElementById("userList")
let nameInput = document.getElementById("nameInput");
let nameButton = document.getElementById("nameButton");
const storedName = localStorage.getItem('userName');

// Message Vars

let messageInput = document.getElementById("messageInput");
let messageButton = document.getElementById("messageButton");
let messageContainer = document.getElementById("messageContainer"); 

//Handling Name Shit 

if (storedName) {
  nameInput.value = storedName;
}

nameButton.addEventListener("click", function() {
  event.preventDefault();

  if (nameInput.value != "") {
    userName = nameInput.value;
    localStorage.setItem('userName', userName);
    document.getElementById("nameField").classList.add("is-hidden");
    // nameButton.classList.add("is-hidden");
    document.getElementById("interface").classList.remove("is-hidden");
    
    socket.emit("join", {id: socket.id, name: userName});
    
  } else {
    nameInput.placeholder = "You need to enter something my dude";
  }

});

nameInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();   
    nameButton.click();
  }
});

// Getting User List

socket.on("updateUsers", data => {

  data.forEach(user => {
    
    userList.innerHTML += "<p>" + user + "</p>"
    
  });
});

// Get Last 10 Previously Sent Messages

socket.on("lastMessages", data => {
  data.forEach(message => {
    messageContainer.innerHTML += "<p>" + message + "</p>";
  });
});

// Sending / Receiving Messages

socket.on('message', data => {
  if (userName !== "") {
    messageContainer.innerHTML += "<p>" + data + "</p>";
  }
});

messageButton.addEventListener("click", function() {
  event.preventDefault();

  if (messageInput.value != "") {
    socket.emit("message", messageInput.value);
    messageInput.value = "";
  }

});

messageInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();   
    messageButton.click();
  }
});

// Sending Images


document.getElementById("imageButton").addEventListener("click", function() {
  let imgUrl = prompt("Enter the URL of an image here", "https://i.kym-cdn.com/photos/images/newsfeed/001/548/016/cc1.gif");
  
  if (imgUrl !== "") {
    socket.emit("image", imgUrl);
  }
  
})