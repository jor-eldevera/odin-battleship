let { GameBoard } = require("./GameBoard.js");

let gameboard = new GameBoard();

it("gameboard: place ship", () => {
    gameboard.placeShip([0, 0], true, 5);
    expect(gameboard.getShips()[0].getCoordinates()).toEqual([0, 0]);
})

it("gameboard: recieve attack miss", () => {
    let coordinates = [5, 5];
    let isHit = gameboard.recieveAttack(coordinates);
    expect(isHit).toBeFalsy();
    expect(gameboard.getMisses()[0]).toEqual(coordinates);
});

it("gameboard: recieve attack hit", () => {
    let isHit = gameboard.recieveAttack([0, 0]);
    expect(isHit).toBeTruthy();
    expect(gameboard.getShips()[0].getHits()).toBe(1);
});

it("gameboard: recieve attack hit on non-head coordinate", () => {
    let isHit = gameboard.recieveAttack([0, 1]);
    expect(isHit).toBeTruthy();
    expect(gameboard.getShips()[0].getHits()).toBe(2);
});

it("gameboard: check if all ships are sunk", () => {
    gameboard.placeShip([1, 0], false, 3);

    // Kill the ship placed at [0, 0] (in the "place ship" test)
    gameboard.recieveAttack([0, 2]);
    gameboard.recieveAttack([0, 2]);
    gameboard.recieveAttack([0, 4]);

    // Kill the ship placed at [1, 0]
    gameboard.recieveAttack([1, 0]);
    gameboard.recieveAttack([2, 0]);
    gameboard.recieveAttack([3, 0]);

    expect(gameboard.checkAllShipsSunk()).toBeTruthy();
});