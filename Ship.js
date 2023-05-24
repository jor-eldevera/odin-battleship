class Ship {
    #length;
    #hits;
    #isSunk;

    constructor(length) {
        this.#length = length;
        this.#hits = 0;
        this.#isSunk = false;
    }

    getLength() {
        return this.#length;
    }

    getHits() {
        return this.#hits;
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
