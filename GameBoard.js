import { Ship } from "./Ship.js";

export class GameBoard {

    #ships = [];
    #hits = [];
    #misses = [];
    #size = 10;

    constructor() {

    }

    getShips() {
        return this.#ships;
    }

    getHits() {
        return this.#hits;
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
        // check for zero or less coordinates
        if (coordinates[0] <= 0 || coordinates[1] <= 0) {
            throw new Error("placeShip: cannot place ship at [" + coordinates[0] + ", " + coordinates[1] + "]");
        }

        // check if it fits on the board
        // if it's vertical, make sure it's not too low
        if (isVertical && (coordinates[1] > (this.#size - length + 1))) {
            throw new Error("placeShip: cannot place vertical ship at [" + coordinates[0] + ", " + coordinates[1] + "]");
        }
        // if it's horizontal, make sure it's not too far to the right
        if (!isVertical && (coordinates[0] > (this.#size - length + 1))) {
            throw new Error("placeShip: cannot palce horizontal ship at [" + coordinates[0] + ", " + coordinates[1] + "]");
        }

        this.#ships.push(new Ship(coordinates, isVertical, length));
    }

    /**
     * Recieve an attack at specified coordinates
     * @param {Array} attackCoordinates is an array of coordinates in [x, y] form
     * @returns true if an attack was made, false otherwise
     */
    recieveAttack(attackCoordinates) {
        for (let ship of this.#ships) {
            let shipCoordinates = ship.getCoordinates();
            for (let i = 0; i < ship.getLength(); i++) {
                let tempCoordinates; // used to see if the attackCoordinates are on the ship
                if (ship.getIsVertical()) {
                    tempCoordinates = [shipCoordinates[0], shipCoordinates[1] + i];
                } else {
                    tempCoordinates = [shipCoordinates[0] + i, shipCoordinates[1]];
                }

                // if the attack is on the ship, record a hit
                if (this.compareArrays(attackCoordinates, tempCoordinates)) {
                    ship.hit();
                    this.#hits.push(tempCoordinates);
                    return true;
                }
            }
        }

        // if no hit was recorded, record a miss
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