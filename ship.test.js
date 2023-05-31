import { Ship } from "./Ship.js";

let ship = new Ship([0, 0], true, 5);

it("ship: new ship length", () => {
    expect(ship.getLength()).toBe(5);
});

it("ship: take a hit", () => {
    ship.hit();
    expect(ship.getHits()).toBe(1);
});

it("ship: isSunk", () => {
    for (let i = 0; i < ship.getLength() - 1; i++) {
        ship.hit();
    }
    expect(ship.isSunk()).toBeTruthy();
});