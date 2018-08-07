module.exports = class Player {
  constructor(id, name, image) {
    this.id = id;
    this.name = name;
    this.image = image;
  }

  get id() {
    return this.id;
  }
  set id(value) {
    this.id = value;
  }

  get name() {
    return this.name;
  }
  set name(value) {
    this.name = value;
  }

  get image() {
    return this.image;
  }
  set image(value) {
    this.image = value;
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
