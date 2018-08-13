"use strict";
const wordList = require('../assets/words.json');
const whiteCards = require('../assets/whiteCards/basic.json');
const blackCards = require('../assets/blackCards/basic.json');


module.exports.getSecretCode = function getSecretCode() {
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

module.exports.getWhiteCards = function getWhiteCards() {
  return whiteCards;
}

module.exports.getBlackCards = function getBlackCards() {
  return blackCards;
}

module.exports.arrayRemoveAdd = function getBlackCards(arrayRemove, index, arrayAdd) {
  arrayAdd.push(arrayRemove.splice(index, 1)[0]);
}
