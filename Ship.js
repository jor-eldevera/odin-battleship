class Ship {
    #length;
    #hits;
    #isSunk;
    #coordinates

    constructor(coordinates, length) {
        this.#length = length;
        this.#hits = 0;
        this.#isSunk = false;
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

    hit() {
        if (!this.#isSunk) this.#hits++;
        if (this.#hits === this.#length) this.#isSunk = true;
    }

    isSunk() {
        return this.#isSunk;
    }
}

module.exports = {
    Ship
}
