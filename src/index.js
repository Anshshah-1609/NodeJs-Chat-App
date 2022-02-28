const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const { generateMsg, locationMsg } = require('./utils/message')
const { addUser, getUser, getUserInRoom, removeUser } = require('./utils/user')
// const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
console.log("Chat-App")

const publicPath = path.join(__dirname,'../public')

app.use(express.static(publicPath))

// let count = 0

io.on('connection',(socket)=>{

    socket.on('join', ({ username, room }, callback) => {
        const {error, user} = addUser({ id:socket.id, username, room})
        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)
        socket.emit("message", generateMsg('Admin',`Welcome to ${user.room} room !`))
                // send message to all user but in specific room's Users
        socket.broadcast.to(user.room).emit("message", generateMsg('Admin',` ${user.username} has join to the chat !!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users : getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMsg(user.username, message))
        callback()   
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        setTimeout(() => {
            io.to(user.room).emit('location', locationMsg(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
            callback()
        },1500) 
    })

    // Run when user disconnected.
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMsg(`${user.username} has left!!`))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUserInRoom(user.username)
            })
        }
    })
})

server.listen(port, () => {
    console.log("Server is up on :",port)
})