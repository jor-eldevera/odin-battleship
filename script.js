import { Player } from "./Player.js";

const BOARD_SIZE = 10;

const playerOneContainer = document.getElementById("p1-container");
const shipsContainer = document.getElementById("ships");

const switchDirectionsBtn = document.getElementById("switch-directions-btn");

let verticalDirection = true; // true if vertical, false if horizontal
let activeShip;

let playerOne = new Player();
let playerTwo = new Player();
let playerOneBoard = playerOne.getGameboard();
let playerTwoBoard = playerTwo.getGameboard();
// place ships
playerOneBoard.placeShip([1, 1], true, 5);
playerOneBoard.placeShip([2, 1], true, 4);
playerOneBoard.placeShip([3, 1], true, 3);
playerOneBoard.placeShip([4, 1], true, 3);
playerOneBoard.placeShip([5, 1], true, 2);

playerTwoBoard.placeShip([1, 6], false, 5);
playerTwoBoard.placeShip([1, 7], false, 4);
playerTwoBoard.placeShip([1, 8], false, 3);
playerTwoBoard.placeShip([1, 9], false, 3);
playerTwoBoard.placeShip([1, 10], false, 2);

// shoot ships

createStartingGrid();
function createStartingGrid() {
    for (let i = 0; i <= BOARD_SIZE; i++) {
        for (let j = 0; j <= BOARD_SIZE; j++) {
            const square = document.createElement("div");
            if (i !== 0 && j !== 0) { // if we're not looking at the border
                square.classList.add("square");
                square.addEventListener("click", (e) => {
                    // if the square doesn't have children and a ship is active, add the overlay
                    if (!square.firstChild && activeShip) {
                        // first detect the ship we're trying to add
                        let shipType = activeShip.id.split("-")[0];
                        let shipDirection = activeShip.id.split("-")[1];
                        let newShipID = activeShip.id + "-overlay";
                        let imageURL = activeShip.style.backgroundImage.slice(5, -2);
                        let width = activeShip.style.width;
                        let height = activeShip.style.height;
                        
                        // then detect if the ship is small enough to be placed at this square
                        let isVertical = false;
                        if (shipDirection === "vertical") {
                            isVertical = true;
                        } else if (shipDirection === "horizontal") {
                            isVertical = false;
                        } else {
                            isVertical = null;
                        }
                        let verticalShipIsSmallEnough = !(isVertical && (i > (BOARD_SIZE - lookUpShipSize(activeShip.id) + 1)));
                        let horizontalShipIsSmallEnough = !(!isVertical && (j > (BOARD_SIZE - lookUpShipSize(activeShip.id) + 1)));
                        if (verticalShipIsSmallEnough && horizontalShipIsSmallEnough) {
                            // then remove the previous ship if it's already there
                            let oldShipHorizontal = document.querySelector("#" + shipType + "-horizontal-overlay");
                            if (oldShipHorizontal) {
                                const parentSquare = oldShipHorizontal.parentNode;
                                parentSquare.removeChild(oldShipHorizontal);
                            }
                            let oldShipVertical = document.querySelector("#" + shipType + "-vertical-overlay");
                            if (oldShipVertical) {
                                const parentSquare = oldShipVertical.parentNode;
                                parentSquare.removeChild(oldShipVertical);
                            }
    
                            // finally add the new ship
                            const newShip = createShipForBoardOverlay(newShipID, shipDirection, imageURL, width, height);
                            square.appendChild(newShip);

                            // if five ships are placed, move on to the next stage
                            if (fiveShipsPlaced()) {
                                console.log("test");
                            }
                        }
                    }
                });
            }
            
            playerOneContainer.appendChild(square);
        }
    }
}

switchDirectionsBtn.addEventListener("click", (e) => {
    if (verticalDirection) {
        addHorizontalShipsToBottom();
        shipsContainer.style.flexDirection = "column";
        verticalDirection = !verticalDirection;
    } else {
        addVerticalShipsToBottom();
        shipsContainer.style.flexDirection = "row";
        verticalDirection = !verticalDirection;
    }
});

shipsContainer.addEventListener("click", (e) => {
    // Check if the clicked element has the "select-ship" class
    if (e.target.classList.contains('select-ship')) {
        const selectedElement = e.target;

        // Remove the green border from all elements
        const selectShipElements = shipsContainer.getElementsByClassName('select-ship');
        Array.from(selectShipElements).forEach((element) => {
            element.style.border = '';
        });

        // Add green border to the clicked element7
        selectedElement.style.border = '1px solid green';
    }
});

addVerticalShipsToBottom();
function addVerticalShipsToBottom() {
    removeAllChildNodes(shipsContainer);
    
    const patrolVertical = createShipForBottom("patrol-vertical", "vertical", "Ships/patrol_vertical.png", "32px", "62px");
    shipsContainer.appendChild(patrolVertical);

    const destroyerVertical = createShipForBottom("destroyer-vertical", "vertical", "Ships/destroyer_vertical.png", "32px", "93px");
    shipsContainer.appendChild(destroyerVertical);

    const submarineVertical = createShipForBottom("submarine-vertical", "vertical", "Ships/submarine_vertical.png", "31px", "93px");
    shipsContainer.appendChild(submarineVertical);

    const battleshipVertical = createShipForBottom("battleship-vertical", "vertical", "Ships/battleship_vertical.png", "31px", "125px");
    shipsContainer.appendChild(battleshipVertical);

    const carrierVertical = createShipForBottom("carrier-vertical", "vertical", "Ships/carrier_vertical.png", "32px", "155px");
    shipsContainer.appendChild(carrierVertical);
}

function addHorizontalShipsToBottom() {
    removeAllChildNodes(shipsContainer);

    const patrolHorizontal = createShipForBottom("patrol-horizontal", "horizontal", "Ships/patrol_horizontal.png", "63px", "32px");
    shipsContainer.appendChild(patrolHorizontal);

    const destroyerHorizontal = createShipForBottom("destroyer-horizontal", "horizontal", "Ships/destroyer_horizontal.png", "93px", "32px");
    shipsContainer.appendChild(destroyerHorizontal);

    const submarineHorizontal = createShipForBottom("submarine-horizontal", "horizontal", "Ships/submarine_horizontal.png", "94px", "32px");
    shipsContainer.appendChild(submarineHorizontal);

    const battleshipHorizontal = createShipForBottom("battleship-horizontal", "horizontal", "Ships/battleship_horizontal.png", "124px", "32px");
    shipsContainer.appendChild(battleshipHorizontal);

    const carrierHorizontal = createShipForBottom("carrier-horizontal", "horizontal", "Ships/carrier_horizontal.png", "155px", "33px");
    shipsContainer.appendChild(carrierHorizontal);
}

/**
 * Create a ship
 * @param {String} id is the id of the element
 * @param {String} direction is the direction of the ship (either "vertical" or "horizontal")
 * @param {String} imageURL is the url of the image
 * @param {String} width is the width of the image. Must include "px"
 * @param {String} height is the height of the image. Must include "px"
 * @returns a div with the background as the imageURL and size width x height
*/
function createShip(id, direction, imageURL, width, height) {
    const ship = document.createElement("div");
    ship.id = id;
    ship.style.backgroundImage = `url('${imageURL}')`;
    ship.style.width = width;
    ship.style.height = height;
    ship.classList.add(direction);
    ship.classList.add("select-ship");
    return ship;
}

/**
 * Create a ship to be used at the bottom of the page when placing ships
 * @param {String} id is the id of the element
 * @param {String} direction is the direction of the ship (either "vertical" or "horizontal")
 * @param {String} imageURL is the url of the image
 * @param {String} width is the width of the image. Must include "px"
 * @param {String} height is the height of the image. Must include "px"
 * @returns a div with the background as the imageURL, size "width x height", and an event listener which changes the active ship 
*/
function createShipForBottom(id, direction, imageURL, width, height) {
    const ship = createShip(id, direction, imageURL, width, height);

    ship.addEventListener("click", (e) => {
        activeShip = ship;
        ship.style.border = "1px solid green";
    });
    return ship;
}

/**
 * Create a ship to be used on the board when placing ships
 * @param {String} id is the id of the element
 * @param {String} direction is the direction of the ship (either "vertical" or "horizontal")
 * @param {String} imageURL is the url of the image
 * @param {String} width is the width of the image. Must include "px"
 * @param {String} height is the height of the image. Must include "px"
 * @returns a div with the background as the imageURL, size "width x height"
*/
function createShipForBoardOverlay(id, direction, imageURL, width, height) {
    const ship = createShip(id, direction, imageURL, width, height);

    return ship;
}

/**
 * Find the size of a ship in squares
 * @param {String} id id of the ship (ship filename with a dash instead of an underscore, also excluding ".png")
 * @returns the size of the ship in squares
 */
function lookUpShipSize(id) {
    let shipSize = 0;

    switch(id) {
        case "patrol-horizontal":
        case "patrol-vertical":
            shipSize = 2;
            break;
        case "destroyer-horizontal":
        case "destroyer-vertical":
        case "submarine-horizontal":
        case "submarine-vertical":
            shipSize = 3;
            break;
        case "battleship-horizontal":
        case "battleship-vertical":
            shipSize = 4;
            break;
        case "carrier-horizontal":
        case "carrier-vertical":
            shipSize = 5;
            break;
        default:
            shipSize = 0;
    }

    return shipSize;
}

/**
 * Checks if five ships have been placed on the board
 */
function fiveShipsPlaced() {
    let squares = document.getElementsByClassName("square");
    let shipCount = 0;
    for (let square of squares) {
        if (square.hasChildNodes()) {
            shipCount++;
        }
    }

    if (shipCount === 5) {
        return true;
    }
    return false;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}