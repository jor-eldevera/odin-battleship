export class Ship {
    #length;
    #hits;
    #isSunk;
    #coordinates;
    #isVertical;
    #shipType;
    #url;
    #imgWidth;
    #imgHeight;

    /**
     * Construct a new ship
     * @param {Array} coordinates is an array of coordinates in [x, y] form
     * @param {Boolean} isVertical true if ship is vertical, false for horizontal
     * @param {Integer} length is the length of the ship
     * @param {Array} imgInfo is an array of some info for the img of this ship.
     * [0] is the url, [1] is the width (px), [2] is the height (px)
     */
    constructor(coordinates, isVertical, length, shipType, imgInfo) {
        this.#length = length;
        this.#hits = 0;
        this.#isSunk = false;
        this.#isVertical = isVertical;
        this.#coordinates = coordinates;
        this.#shipType = shipType;
        this.#url = imgInfo[0];
        this.#imgWidth = imgInfo[1];
        this.#imgHeight = imgInfo[2]
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

    getURL() {
        return this.#url;
    }

    getImgWidth() {
        return this.#imgWidth;
    }

    getImgHeight() {
        return this.#imgHeight;
    }

    getShipType() {
        return this.#shipType;
    }

    hit() {
        if (!this.#isSunk) this.#hits++;
        if (this.#hits === this.#length) this.#isSunk = true;
    }

    isSunk() {
        return this.#isSunk;
    }
}
