'use strict';
// add global functions and extensions
var functions = require("../Global/functions.js");
require("../Global/extensions.js");

// STATES:
//   JOIN
//   SETJUDGE
//   CHOOSECARD
//   SCORE
//   WINGAME
module.exports = class Room {
  constructor(secretCode) {
    this.secretCode = secretCode;
    this.startTime = new Date();
    this.playerList = [];
    this.started = false;
    this.whiteCards = [];
    this.blackCards = [];
  }

  addPlayer(player) {
    if(this.started) {
      console.error(`the game: ${ this.secretCode } has already started. cannot join.`);
      return false;
    }
    else {
      var isAdded = this.playerList.playerExists(player.id);
      if(isAdded) {
        // add player to rooms player list
        this.playerList.push(player);
        console.log(`the player: ${ player.name }, was added to the room: ${ this.secretCode }`);
      }
      else {
         console.error(`the player: ${ player.name }, already exists in the room: ${ this.secretCode }`);
      }
      return isAdded;
    }
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

  assignPlayerCards() {
    for (var i=0; i < this.playerList.length; i++) {
        var player = this.playerList[i];
        if(player.whiteCards.length < 10) {
          for (var x=0; player.whiteCards.length == 10; x++) {
            var wIndex = this.whiteCards.getRandomIndex();
            arrayRemoveAdd(this.whiteCards, wIndex, player.whiteCards);
          }
        }
      }
    }

    setJudge() {
      var judgeIndex = this.playerList.findIndex(x => x.judge == true);
      if(judgeIndex == -1 || judgeIndex == this.playerList.length) {
        judgeIndex == 0;
      }
      else {
        judgeIndex++;
      }
      // set all to false
      this.playerList = this.playerList.map(p => p.judge = false);
      // set the new judge
      this.playerList[judgeIndex].judge = true;
    }

    startNewRound() {
      // deal cards to players
      this.whiteCards = getWhiteCards();
      this.blackCards = getBlackCards();
      this.assignPlayerCards();
      // choose the judge for the round
      this.setJudge();
    }
}
