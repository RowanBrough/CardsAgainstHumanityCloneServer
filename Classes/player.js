module.exports = class Player {
  constructor(id, host, name, image) {
    this.id = id;
    this.host = host;
    this.name = name;
    this.image = image;
  }

  get id() {
    return this.id;
  }

  get host() {
    return this.host;
  }
  
  get name() {
    return this.name;
  }

  get image() {
    return this.image;
  }

  get whiteCards() {
    return this.whiteCards;
  }
  set whiteCards(value) {
    this.whiteCards = value;
  }

  get blackCards() {
    return this.blackCards;
  }
  set blackCards(value) {
    this.blackCards = value;
  }
}
