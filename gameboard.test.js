// const { it } = require("jest-circus");
let { GameBoard } = require("./GameBoard.js");
// const { default: expect } = require("expect");

let gameboard = new GameBoard();

it("gameboard: place ship", () => {
    gameboard.placeShip([0, 0], 5);
    expect(gameboard.getShips()[0].getCoordinates()).toEqual([0, 0]);
})