const { GameBoard } = require("./GameBoard.js");

class Player {
    #gameboard;

    constructor() {
        this.#gameboard = new GameBoard();
    }

    getGameboard() {
        return this.#gameboard;
    }
}

module.exports = {
    Player
}