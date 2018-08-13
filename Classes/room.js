require("./Global/extensions.js");

// STATES:
//   JOIN
//   SETJUDGE
//   CHOOSECARD
//   SCORE
//   WINGAME
module.exports = class Room {
  constructor(secretCode, state) {
    this.secretCode = secretCode;
    this.startTime = new Date();
    this.playerList = [];
    this.started = false;
    this.state = state;
  }
  
  get started() {
    return this.started;
  }
  set started(value) {
    this.started = value;
  }

  addPlayer(player) {
    var isAdded = !this.playerList.playerExists(player.id);
    if(isAdded) {
      // add player to rooms player list
      this.playerList.push(player);
      console.log(`the player: ${ player.name }, was added to the room: ${ this.secretCode }`);
    }
    else {
       // throw error
       console.error(`the player: ${ player.name }, already exists in the room: ${ this.secretCode }`);
    }
    return isAdded;
  }

  removePlayer(playerId) {
    var playerExists = this.playerList.playerExists(playerId);
    if(playerExists.response) {
      // remove the player
      this.playerList.splice(playerExists.index, 1);
      // let the room know a player was removed
      io.to(this.secretCode).emit('PLAYER_REMOVED', this.playerList);
      console.log(`the player: ${ playerExists.player.name }, was disconnected from the room: ${ this.secretCode }`);
    }
  }
}