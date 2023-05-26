const { Ship } = require("./Ship.js");

class GameBoard {

    #ships = [];
    #misses = [];

    constructor() {

    }

    getShips() {
        return this.#ships;
    }

    placeShip(coordinates, length) {
        this.#ships.push(new Ship(coordinates, length));
    }
}

module.exports = {
    GameBoard
}