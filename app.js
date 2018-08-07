var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Room = require('./Classes/room.js');
var Player = require('./Classes/player.js');
const wordList = require('./assets/words.json');

const roomList = []

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

// TODO: remove player from roomlist on disconnect
// TODO: remove inactive rooms every 30 seconds
// TODO: find out how to transfer large amounts of data from client to server and visa versa

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected', socket.id);
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected', socket.id);
   });

   socket.on('HOST_REQUEST', function() {
     var secretCode = getSecretCode();
     // check if a room with this secret code exists
     var roomExists = roomList.roomExists(secretCode);
     while (roomExists) {
       roomExists = roomList.roomExists(secretCode);
     }
     // add the room to roomList
     var room = new Room(secretCode, 'JOIN');
     roomList.push(room);
     console.log(`a room has been created with code: ${secretCode}`);
     console.log('Room Object: ', room);
     console.log('Room List: ', roomList);
     io.to(socket.id).emit('HOST_RESPONSE', secretCode);
   });

   // secretCode, name, image
   socket.on('JOIN_REQUEST', function(params) {
     // check if a room with this secret code exists
     var roomExists = roomList.roomExists(params.secretCode);
     if(roomExists) {
       // find the room
       var room = roomList.find(room => {
         return room.secretCode === params.secretCode
       });
       // create a player and add them to the room
       var player = new Player(socket.id, params.name, params.image);
       console.log(`a player wants to join the room ${params.secretCode}, the player is: ${player}`);
       var response = room.addPlayer(player);
       if(response.isAdded) {
         io.to(params.secretCode).emit('PLAYER_JOINED', room.playerList);
         console.log(`the player: ${ name }, was added to the room: ${ secretCode }`);
       }
       else {
         // throw error
         console.error(`the player: ${ name }, already exists in the room: ${ secretCode }`);
         io.to(socket.id).emit('JOIN_RESPONSE')
       }
     }
     console.log(`joining with the secret code: ${params.secretCode} - it ${(roomExists?"exists":"doesn't exist")}`, roomList);
     io.to(socket.id).emit('JOIN_RESPONSE', roomExists);
   });

});

http.listen(3000, function() {
   console.log('listening on *:3000');
});


Object.prototype.roomExists = function(secretCode) {
  for (var i=0; i < this.length; i++) {
      if (this[i].secretCode === secretCode) {
          return true;
      }
  }
  return false;
}

function getSecretCode() {
  // copy the word list array for non destructive manipulation
  var words = wordList;
  // get a random index for a word
  var index = Math.floor(Math.random() * words.length) + 1;
  // add the word to the variable
  var wordOne = words[index];
  // remove the word from the array
  words.splice(index, 1);
  // repeat process
  index = Math.floor(Math.random() * words.length) + 1;
  var wordTwo = words[index];
  return wordOne + wordTwo;
}
