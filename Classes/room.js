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

  removePlayer(playerId, io) {
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
      // set the old judge to ordinary player
      if(judgeIndex === -1) {
        judgeIndex = 0;
      }
      else {
        this.playerList[judgeIndex].judge = false;
        if(judgeIndex == this.playerList.length) {
          judgeIndex = 0;
        }
        else {
          judgeIndex++;
        }
      }
      // set the new judge
      this.playerList[judgeIndex].judge = true;
    }

    startNewRound() {
      this.started = true;
      // deal cards to players
      this.whiteCards = functions.getWhiteCards();
      this.blackCards = functions.getBlackCards();
      this.assignPlayerCards();
      // choose the judge for the round
      this.setJudge();
      return this;
    }
}
