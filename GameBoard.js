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
     * @param {Array} imgInfo is an array of some info for the img of this ship.
     * [0] is the url, [1] is the width (px), [2] is the height (px)
     */
    placeShip(coordinates, isVertical, length, shipType, imgInfo) {
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

        this.#ships.push(new Ship(coordinates, isVertical, length, shipType, imgInfo));
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
                if (GameBoard.compareArrays(attackCoordinates, tempCoordinates)) {
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

    /**
     * Checks if the coordinates passed are already in the hits or misses arrays
     * @param {Array} coordinates is an array of coordinates [x, y]
     * @returns true if shot was made, false if shot is new
     */
    checkIfShotAlreadyMade(coordinates) {
        for (let shot of this.#hits) {
            if (GameBoard.compareArrays(shot, coordinates)) {
                return true;
            }
        }
        
        for (let shot of this.#misses) {
            if (GameBoard.compareArrays(shot, coordinates)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks what kind of shot was shot at the passed coordinates
     * @param {Array} coordinates is an array in [x, y] form
     * @returns "hit" if the shot at these coordinates is a hit, "miss", or "none"
     */
    getShotTypeAtCoordinates(coordinates) {
        for (let shot of this.#hits) {
            if (GameBoard.compareArrays(shot, coordinates)) {
                return "hit";
            }
        }
        
        for (let shot of this.#misses) {
            if (GameBoard.compareArrays(shot, coordinates)) {
                return "miss";
            }
        }

        return "none";
    }

    static compareArrays(a, b) {
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