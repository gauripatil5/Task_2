//js file for website 
//frontend

//we are connecting website(this file) to nodeserver (backend server)

const socket=io('http://localhost:8000');

const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector(".container");
var audio=new Audio('ting.mp3');

const append=(message,position)=>{
  const messageElement=document.createElement('div');
  messageElement.innerText=message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);

  if(position=='left'){
    audio.play();
  }
 
}

let username=prompt("Please enter ur name to join:");
if(username==null)
    {
        alert("You must enter a name to join.");
        location.reload(); // Reload the page if the user cancels
    }

else{

//event is emitted from here and listened at index.js

// Emit event for new user joining
socket.emit('new-user-joined',username);

// Listen for other users joining
socket.on('user-joined',username=>{
   append(`${username} joined the chat`,'right')
});

// Listen for receiving messages
socket.on('receive',data=>{
    append(`${data.username}:${data.message} `,'left')
 });

 // Handle message sending
 form.addEventListener('submit',(e)=>{
    e.preventDefault ;//do not reload the page
    const message=messageInput.value;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';// Clear input after sending
 });

 // Listen for users leaving
 socket.on('leave',username=>{
    append(`${username} left the chat`,'left')
 });
}
