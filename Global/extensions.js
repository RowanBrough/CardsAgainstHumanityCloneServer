'use strict';

Object.prototype.getRandomIndex = function() {
  var len = this.length;
  return Math.floor(Math.random() * len);
}

Object.prototype.checkObjectArrayWithValue = function(keyName, keyValue) {
    for (var i=0; i < this.length; i++) {
        if (this[i][keyName] === keyValue) {
            return true;
        }
    }
    return false;
}

Object.prototype.playerExists = function(id) {
  console.log('checking the player list: ', this);
    for (var i=0; i < this.length; i++) {
        if (this[i].id === id) {
          console.log('found player: ', this[i]);
            return {
                response:true,
                index: i,
                player: this[i]
            };
        }
    }
    return {
        response:false
    };
}

Object.prototype.roomExists = function(secretCode) {
    for (var i=0; i < this.length; i++) {
        if (this[i].secretCode === secretCode) {
          console.log('roomExists: ', this[i]);
            return {
                response:true,
                index: i,
                room: this[i]
            };
        }
    }
    return {
        response:false
    };
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.subtractHours = function(h) {
    this.setTime(this.getTime() - (h*60*60*1000));
    return this;
 }

Object.prototype.roomCleanup = function() {
    for (var i=0; i < this.length; i++) {
        var room = this[i];
        var today = new Date().subtractHours(1);

        if(room.playerList.length == 0) {
            // all players have been disconnected - delete it
            this.splice(i, 1);
            console.log(`the room: ${room.secretCode} has been deleted - no players`);
        }
        // else if( (!room.started) && (room.startTime.getTime() <= today.getTime()) ) {
        //     // the room hasnt started a game
        //     // the room is older than an hour
        //     // delete it
        //     this.splice(i, 1);
        //     console.log(`the room: ${room.secretCode} has been deleted - inactive room`);
        // }
    }
}
