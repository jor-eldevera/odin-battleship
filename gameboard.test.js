let { GameBoard } = require("./GameBoard.js");

let gameboard = new GameBoard();

it("gameboard: place ship", () => {
    gameboard.placeShip([1, 1], true, 5);
    expect(gameboard.getShips()[0].getCoordinates()).toEqual([1, 1]);
});

it("gameboard: place ship in negative location", () => {
    expect(() => gameboard.placeShip([-1, 0], true, 5)).toThrow();
});

it("gameboard: place horizontal ship too far to the right", () => {
    expect(() => gameboard.placeShip([7, 1], false, 5)).toThrow();
});

it("gameboard: place vertical ship too low", () => {
    expect(() => gameboard.placeShip([1, 7], true, 5)).toThrow();
});

it("gameboard: place ship off the board (positive location)", () => {
    expect(() => gameboard.placeShip([11, 11], true, 5)).toThrow();
});

it("gameboard: recieve attack miss", () => {
    let coordinates = [5, 5];
    let isHit = gameboard.recieveAttack(coordinates);
    expect(isHit).toBeFalsy();
    expect(gameboard.getMisses()[0]).toEqual(coordinates);
});

it("gameboard: recieve attack hit", () => {
    let isHit = gameboard.recieveAttack([1, 1]);
    expect(isHit).toBeTruthy();
    expect(gameboard.getShips()[0].getHits()).toBe(1);
});

it("gameboard: recieve attack hit on non-head coordinate", () => {
    let isHit = gameboard.recieveAttack([1, 2]);
    expect(isHit).toBeTruthy();
    expect(gameboard.getShips()[0].getHits()).toBe(2);
});

it("gameboard: check if all ships are sunk", () => {
    gameboard.placeShip([2, 1], false, 3);

    // Kill the ship placed at [0, 0] (in the "place ship" test)
    gameboard.recieveAttack([1, 3]);
    gameboard.recieveAttack([1, 4]);
    gameboard.recieveAttack([1, 5]);

    // Kill the ship placed at [2, 1]
    gameboard.recieveAttack([2, 1]);
    gameboard.recieveAttack([3, 1]);
    gameboard.recieveAttack([4, 1]);

    expect(gameboard.checkAllShipsSunk()).toBeTruthy();
});