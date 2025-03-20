//node server-backend sever
//node sever which will handle socket.io connections

const { socket } = require('socket.io');
//socket.io(server) will listen incomming events

const express = require('express');
const cors=require('cors');
const io=require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",  // Your frontend URL
        methods: ["GET", "POST"]
    }
});

const app = express();
app.use(cors()); // Allow cross-origin requests

const users={};

//io.on is a socket instance, it will listen to all socket connections(user1,user2..)
//socket.on handles the perticular connection/perticular event
//socket.on accepts an event(ex.new-user joined) and performs function according to it
io.on('connection',socket=>{

    //events will emitted from client.js and listend here
    socket.on('new-user-joined',username=>{
        if (!username) return; // Ensure username is not null or empty
        users[socket.id]=username;
        console.log("new user ",username);
        socket.broadcast.emit('user-joined',username);
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,username:users[socket.id]})
    });

    socket.on('disconnect',()=>{
        // socket.broadcast.emit('leave',users[socket.id]);
        // delete users[socket.id];// Remove user from list

        const username = users[socket.id];
        if (username) {
            socket.broadcast.emit('leave', username);
            delete users[socket.id]; // Remove user from list
        }
        
    });




})