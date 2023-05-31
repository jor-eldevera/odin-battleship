import { GameBoard } from "./GameBoard.js";

export class Player {
    #gameboard;

    constructor() {
        this.#gameboard = new GameBoard();
    }

    getGameboard() {
        return this.#gameboard;
    }
}