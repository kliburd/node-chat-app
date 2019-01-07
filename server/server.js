const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname, '../public/')
const express = require('express')
const socketio = require('socket.io')

const {generateMessage} = require('./utils/message')
var app = express()
var server = http.createServer(app);
var io = socketio(server);

const port = process.env.PORT || 3000


app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log("new user connected");

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the club bud'))


  socket.broadcast.emit('newMessage', generateMessage('Admin','Noobie joined this bitch'))


  socket.on('createEmail', (newEmail) => {
    console.log('Create Email', newEmail);
  })

  socket.on('createMessage', (mail, callback) => {
    console.log("Create Message ", mail);
    socket.broadcast.emit('newMessage', generateMessage(mail.from, mail.text))
    callback('This is from the server')
  })

  socket.on('createLocationMessage', (coords) => {
    console.log(`${coords.latitude}, ${coords.longitude}`);
    socket.broadcast.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
  })
  socket.on('disconnect', () => {
    console.log("Lost connection to client");
  })
})


server.listen(port, () => {
  console.log('Started on port 3000');
})
