// add requirements from npm
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// add global functions and extensions
var functions = require("./Global/functions.js");
require("./Global/extensions.js");

// add data classes 
var Room = require('./Classes/room.js');
var Player = require('./Classes/player.js');

const roomList = []

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

// TODO: find out how to transfer large amounts of data from client to server and visa versa

// room cleanup interval - 30 seconds
var roomCleanup = function() {
  console.log(`running room clean up`);
  clearInterval(intervalRoomCleanup);
  roomList.roomCleanup();
};
var intervalRoomCleanup = setInterval(roomCleanup, 30000);

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected', socket.id);
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
     // find player in rooms and remove them
     roomList.forEach(function(room, index) {
       // remove a player if they exist in the room
       room.playerList.removePlayer(socket.id);
      });
   });

   socket.on('HOST_REQUEST', function() {
     var secretCode = functions.getSecretCode();
     // check if a room with this secret code exists
     var roomExists = roomList.roomExists(secretCode).response;
     while (roomExists) {
       roomExists = roomList.roomExists(secretCode).response;
     }
     // add the room to roomList
     var room = new Room(secretCode, 'JOIN');
     roomList.push(room);
     console.log(`a room has been created with code: ${secretCode}`);
     console.log('Room Object: ', room);
     console.log('Room List: ', roomList);
     io.to(socket.id).emit('HOST_RESPONSE', secretCode);
   });

   // secretCode, host, name, image
   socket.on('JOIN_REQUEST', function(params) {
     // check if a room with this secret code exists
     var roomExists = roomList.roomExists(params.secretCode).response;
     if(roomExists) {
       // find the room
       var room = roomList.find(room => {
         return room.secretCode === params.secretCode
       });
       // create a player and add them to the room
       var player = new Player(socket.id, params.host, params.name, params.image);
       console.log(`a player wants to join the room ${params.secretCode}, the player is: ${player}`);
       var isAdded = room.addPlayer(player);
       if(isAdded) {
        // let the room know a player was added
        io.to(player.id).emit('JOIN_RESPONSE', { 
          response: true,
          message: `joined the room: ${params.secretCode}`
         });
        io.to(this.secretCode).emit('PLAYER_JOINED', this.playerList);
      }
      else {
         io.to(player.id).emit('JOIN_RESPONSE', { 
           response: false,
           message: `player already exists in the room: ${params.secretCode}`
          });
      }
    }
  });

});

http.listen(3000, function() {
   console.log('listening on *:3000');
});