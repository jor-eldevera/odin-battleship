const { Ship } = require("./Ship.js");

class GameBoard {

    #ships = [];
    #misses = [];

    constructor() {

    }

    getShips() {
        return this.#ships;
    }

    getMisses() {
        return this.#misses;
    }

    /**
     * Place a new ship
     * @param {Array} coordinates is an array of coordinates in [x, y] form
     * @param {Boolean} isVertical true if ship is vertical, false for horizontal
     * @param {Integer} length is the length of the ship
     */
    placeShip(coordinates, isVertical, length) {
        this.#ships.push(new Ship(coordinates, isVertical, length));
    }

    recieveAttack(attackCoordinates) {
        for (let ship of this.#ships) {
            let shipCoordinates = ship.getCoordinates();
            for (let i = 0; i < ship.getLength(); i++) {
                let tempCoordinates;
                if (ship.getIsVertical()) {
                    tempCoordinates = [shipCoordinates[0], shipCoordinates[1] + i];
                } else {
                    tempCoordinates = [shipCoordinates[0] + i, shipCoordinates[1]];
                }
                if (this.compareArrays(attackCoordinates, tempCoordinates)) {
                    ship.hit();
                    return true;
                }
            }
        }

        this.#misses.push(attackCoordinates);
        return false;
    }

    checkAllShipsSunk() {
        for (let ship of this.#ships) {
            if (!ship.isSunk()) {
                return false;
            }
        }

        return true;
    }

    compareArrays(a, b) {
        if (a.length !== b.length) return false;
        else {
          // Comparing each element of your array
          for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          return true;
        }
      }
}

module.exports = {
    GameBoard
}