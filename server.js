const express=require('express');
const app=express();
const http=require('http');
const dotenv = require('dotenv').config({path:'./.env'});
const server=http.createServer(app);
const socketIo=require('socket.io');
const formatMessage=require('./utils/messages');
const {joinUser,getCurrentUser,leaveRoom,roomUsers}=require('./utils/users');

//static  variables
app.use(express.static('public'));

//io connection
const io=socketIo(server);
const botName='chatCordBot'
io.on('connection',socket=>{
    //join in a particular room
    socket.on('joinRoom',({username,room})=>{
        const user=joinUser(socket.id,username,room);
        socket.join(user.room);

        //get room and room users info
        io.to(user.room).emit('roomInfo',{
            users: roomUsers(user.room),
            room:user.room
        })

        //welcome note
        socket.emit('botMessage',`${user.username} welcome to the chat`);
        //user joins notification to everyone
        socket.broadcast.to(user.room).emit('botMessage',`${user.username} has joined the chat` );
    })

    // chat message
    socket.on('chat-message',(msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

    // left the chat
    socket.on('disconnect',()=>{
        const user=leaveRoom(socket.id)
        if(user){
            io.to(user.room).emit('botMessage',`${user.username} has left the chat`);

        //get room and room users info
        io.to(user.room).emit('roomInfo',{
            users: roomUsers(user.room),
            room:user.room
        })
        }
    })


})

const PORT=4000 || process.env.PORT;
server.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})