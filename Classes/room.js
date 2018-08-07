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
    this.state = state;
  }
  
  addPlayer(Player) {
    var isAdded = !this.playerList.playerExists(Player.name, Player.id);
    if(isAdded) {
      // add player to rooms player list
      this.playerList.push(Player);
      // add the player to the room bradcast
      Player.socket.join(this.secretCode);
    }
    return {
      isAdded: isAdded,
      list: this.playerList
    }
  }
}

Object.prototype.playerExists = function(name, id) {
  for (var i=0; i < this.length; i++) {
      if (this[i].name === name && this[i].id === id) {
          return true;
      }
  }
  return false;
}
