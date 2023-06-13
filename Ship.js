export class Ship {
    #length;
    #hits;
    #isSunk;
    #coordinates;
    #isVertical;

    /**
     * Construct a new ship
     * @param {Array} coordinates is an array of coordinates in [x, y] form
     * @param {Boolean} isVertical true if ship is vertical, false for horizontal
     * @param {Integer} length is the length of the ship
     */
    constructor(coordinates, isVertical, length) {
        this.#length = length;
        this.#hits = 0;
        this.#isSunk = false;
        this.#isVertical = isVertical;
        this.#coordinates = coordinates;
    }

    getLength() {
        return this.#length;
    }

    getHits() {
        return this.#hits;
    }

    getCoordinates() {
        return this.#coordinates;
    }

    getX() {
        return this.#coordinates[0];
    }

    getY() {
        return this.#coordinates[1];
    }

    getIsVertical() {
        return this.#isVertical;
    }

    getDirection() {
        if (this.#isVertical) {
            return "vertical";
        } else {
            return "horizontal";
        }
    }

    hit() {
        if (!this.#isSunk) this.#hits++;
        if (this.#hits === this.#length) this.#isSunk = true;
    }

    isSunk() {
        return this.#isSunk;
    }
}
