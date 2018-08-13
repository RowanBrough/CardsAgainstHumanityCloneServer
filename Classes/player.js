'use strict';
module.exports = class Player {
  constructor(id, host, name, image) {
    this.id = id;
    this.host = host;
    this.name = name;
    this.image = image;
    this.judge = false;
    this.whiteCards = [];
    this.blackCards = [];
  }
}
