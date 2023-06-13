import { Player } from "./Player.js";

const BOARD_SIZE = 10;

const playerOneContainer = document.getElementById("p1-container");
const vsPhaseContainer = document.getElementById("vs-phase")
const gamePhaseContainer = document.getElementById("game-phase");
const choosingPhaseContainer = document.getElementById("choosing-phase");
const battlePhaseContainer = document.getElementById("battle-phase");
const shipsContainer = document.getElementById("ships");

const vsComputerBtn = document.getElementById("play-vs-computer-btn");
const vsPlayerBtn = document.getElementById("play-vs-player-btn");
const switchDirectionsBtn = document.getElementById("switch-directions-btn");
const confirmPlacementBtn = document.getElementById("confirm-placement-btn");
confirmPlacementBtn.disabled = true;
const newGameBtn = document.getElementById("new-game-btn");
newGameBtn.disabled = true;

const winnerText = document.getElementById("winner-text");

let verticalDirection = true; // true if vertical, false if horizontal. used when placing ships
let activeShip;
let gameType; // "computer" if vs comptuer, "player" if vs player

let playerOne = new Player();
let playerTwo = new Player();
let playerOneBoard = playerOne.getGameboard();
let playerTwoBoard = playerTwo.getGameboard();

vsComputerBtn.addEventListener("click", (e) => {
    gameType = "computer";
    confirmPlacementAction = vsComputerAction;

    // Unveil the game-phase stuff
    gamePhaseContainer.style.display = "flex";
    gamePhaseContainer.style.flexDirection = "column";
    gamePhaseContainer.style.alignItems = "center";

    // Hide the vs-phase stuff
    vsPhaseContainer.style.display = "none";

    // Let them choose their ships
    createStartingGrid(playerOneContainer);
});

function createStartingGrid(playerContainer) {
    removeAllChildNodes(playerContainer);
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
                        
                        // then detect if the ship overflows the borders of the map
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

                        // then detect if the ship overlaps other ships
                        let overlapsOtherShips = checkOverlapAllShips(i, j, shipType, shipDirection);
                        // console.log(shipType + " overlap?: " + overlapsOtherShips);

                        if (!overlapsOtherShips && verticalShipIsSmallEnough && horizontalShipIsSmallEnough) {
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
                                unlockConfirmPlacementButton();
                            }
                        }
                    }
                });
            }
            
            square.id = j + "-" + i;
            playerContainer.appendChild(square);
        }
    }
}

switchDirectionsBtn.addEventListener("click", (e) => {
    activeShip = null;
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
        case "patrol":
            shipSize = 2;
            break;
        case "destroyer-horizontal":
        case "destroyer-vertical":
        case "destroyer":
        case "submarine-horizontal":
        case "submarine-vertical":
        case "submarine":
            shipSize = 3;
            break;
        case "battleship-horizontal":
        case "battleship-vertical":
        case "battleship":
            shipSize = 4;
            break;
        case "carrier-horizontal":
        case "carrier-vertical":
        case "carrier":
            shipSize = 5;
            break;
        default:
            shipSize = 0;
    }

    return shipSize;
}

/**
 * Checks if the ship with the given information is overlapping with another ship on the board
 * @param {Number} i the y coordinate
 * @param {Number} j the x coordinate
 * @param {String} shipType the type of the ship
 * @param {String} shipDirection the direction of the ship
 * @returns true if this ship is overlapping with another ship
 */
function checkOverlapAllShips(i, j, shipType, shipDirection) {
    let shipLength = lookUpShipSize(shipType + "-" + shipDirection);
    let squares = document.getElementsByClassName("square");
    for (let square of squares) {
        if (square.hasChildNodes()) {
            let x = Number(square.id.split("-")[0]);
            let y = Number(square.id.split("-")[1]);
            let overlappingShipElement = square.children[0];
            let overlappingShipType = overlappingShipElement.id.split("-")[0];
            let overlappingShipDirection = overlappingShipElement.id.split("-")[1];
            let overlappingShipSize = lookUpShipSize(overlappingShipType + "-" + overlappingShipDirection);

            // A ship can never overlap itself
            if (shipType === overlappingShipType) {
                continue;
            }

            // if (checkOverlap(x, y, shipDirection, shipLength, j, i, overlappingShipDirection, overlappingShipSize)) {
            if (checkOverlap(j, i, shipDirection, shipLength, x, y, overlappingShipDirection, overlappingShipSize)) {
                return true;
            }
        }
    }
    return false;
}

// checkOverlap(5, 7, "horizontal", 3, 7, 3, "vertical", 5);
// checkOverlap(7, 3, "vertical", 5, 5, 7, "horizontal", 3);

/**
 * Checks if two ships are overlapping
 * @param {Number} x The x coordinate of ship 1
 * @param {Number} y The y cooridnate of ship 1
 * @param {String} shipDirection Either vertical or horizontal
 * @param {Number} shipLength The length of ship 1
 * @param {Number} j The x coordinate of ship 2
 * @param {Number} i The y coordinate of ship 2
 * @param {String} overlappingShipDirection Vertical or horizontal direction of ship 2
 * @param {Number} overlappingShipSize The length of ship 2
 * @returns true if overlapping, false otherwise
 */
function checkOverlap(x, y, shipDirection, shipLength, j, i, overlappingShipDirection, overlappingShipSize) {
    // console.log("x=" + x + " y=" + y + " shipDirection=" + shipDirection + " shipLength=" + shipLength + ", j=" + j + " i=" + i + " overlappingShipDirection=" + overlappingShipDirection + " overlappingShipSize=" + overlappingShipSize);
    // Check if ships have different orientations
    if (shipDirection !== overlappingShipDirection) {
        // Check if ship1 is horizontal and ship2 is vertical
        if (shipDirection === 'horizontal' && overlappingShipDirection === 'vertical') {
            if (
                x <= j && x >= j - shipLength + 1 && // x is between j and the end
                i <= y && i >= y - overlappingShipSize + 1 // y is between i and the end
                ) {
                // console.log("x=" + x + " y=" + y + " j=" + j + " i=" + i + " shipLength=" + shipLength + " overlappingShipSize=" + overlappingShipSize);
                console.log("overlap 1");
                return true; // Overlapping ships
            }
        }
        // Check if ship1 is vertical and ship2 is horizontal
        else if (shipDirection === 'vertical' && overlappingShipDirection === 'horizontal') {
            if (
                j <= x && j >= x - overlappingShipSize + 1 &&
                y <= i && y >= i - shipLength + 1
            ) {
                // console.log("x=" + x + " y=" + y + " j=" + j + " i=" + i + " shipLength=" + shipLength + " overlappingShipSize=" + overlappingShipSize);
                console.log("overlap 2");
                return true; // Overlapping ships
            }
        }
    // Check if ships have the same orientation
    } else if (shipDirection === overlappingShipDirection) {
        // Check if ships are horizontal
        if (shipDirection === 'horizontal') {
            // Check if the horizontal segments overlap
            if (i === y && 
                (j + shipLength > x) && 
                (j < x + overlappingShipSize)) {
                // console.log("x=" + x + " y=" + y + " j=" + j + " i=" + i + " shipLength=" + shipLength + " overlappingShipSize=" + overlappingShipSize);
                console.log("overlap 3");
                return true; // Overlapping ships
            }
        } 
        // Check if ships are vertical
        else if (shipDirection === 'vertical') {
            // Check if the vertical segments overlap
            if (j === x && 
                i + shipLength > y && 
                i < y + overlappingShipSize) {
                // console.log("x=" + x + " y=" + y + " j=" + j + " i=" + i + " shipLength=" + shipLength + " overlappingShipSize=" + overlappingShipSize);
                console.log("overlap 4");
                return true; // Overlapping ships
            }
        }
    }

    return false;
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


function unlockConfirmPlacementButton() {
    confirmPlacementBtn.disabled = false;
}

const controller = new AbortController();
const { signal } = controller;
confirmPlacementBtn.addEventListener("click", listenerFunction);

let confirmPlacementAction;

function listenerFunction() {
    confirmPlacementAction();
}

if (gameType === "computer") {
    confirmPlacementAction = vsComputerAction;
} else if (gameType === "player") {
    confirmPlacementAction = vsPlayerAction;
}

function vsComputerAction() {
    choosingPhaseContainer.style.display = "none";

    // Add all pieces to a GameBoard
    addShipsToGameBoard(playerOneBoard);

    // Set up computer's GameBoard
    placeShipsRandomly(playerTwoBoard);

    // Start attacking
    // Remove all squares and replace with new squares
    buildAttackBoard();
}

function addShipsToGameBoard(gameBoard) {
    let squares = document.getElementsByClassName("square");
    for (let square of squares) {
        if (square.hasChildNodes()) {
            let x = Number(square.id.split("-")[0]);
            let y = Number(square.id.split("-")[1]);
            let shipElement = square.children[0];
            let shipType = shipElement.id.split("-")[0];
            let shipDirection = shipElement.id.split("-")[1];
            let shipSize = lookUpShipSize(shipType + "-" + shipDirection);

            let isVertical = false;
            if (shipDirection === "vertical") {
                isVertical = true;
            } else if (shipDirection === "horizontal") {
                isVertical = false;
            }

            gameBoard.placeShip([x, y], isVertical, shipSize);
        }
    }
}

/**
 * Randomly places the 5 ships on a GameBoard
 * @param {GameBoard} gameBoard is the GameBoard ships are placed on
 */
function placeShipsRandomly(gameBoard) {
    let shipType = "patrol";
    let randomCoordinatesAndDirection = generateRandomCoordinates(shipType, gameBoard);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType));

    shipType = "destroyer";
    randomCoordinatesAndDirection = generateRandomCoordinates(shipType, gameBoard);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType));

    shipType = "submarine";
    randomCoordinatesAndDirection = generateRandomCoordinates(shipType, gameBoard);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType));

    shipType = "battleship";
    randomCoordinatesAndDirection = generateRandomCoordinates(shipType, gameBoard);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType));

    shipType = "carrier";
    randomCoordinatesAndDirection = generateRandomCoordinates(shipType, gameBoard);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType));
}

function generateRandomCoordinates(shipType, gameBoard) {
    let shipDirection;
    let isCoordinatesValid = false;
    let x;
    let y;
    while (!isCoordinatesValid) {
        if (Math.floor(Math.random() * 2) === 1) {
            shipDirection = "vertical";
        } else {
            shipDirection = "horizontal"
        }
        x = Math.floor(Math.random() * 10) + 1;
        y = Math.floor(Math.random() * 10) + 1;
        isCoordinatesValid = checkCoordinatesValid(x, y, shipType, shipDirection, gameBoard);
    }

    if (shipDirection === "vertical") {
        shipDirection = true;
    } else if (shipDirection === "horizontal") {
        shipDirection = false;
    }
    return [[x, y], shipDirection];
}

/**
 * Checks if given coordinates & ship type are valid on the passed GameBoard
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 * @param {String} shipType The ship type
 * @param {String} shipDirection The ship direction
 * @param {GameBoard} gameBoard The GameBoard which we're checking
 * @returns true if coordinates valid, false if conficts
 */
function checkCoordinatesValid(x, y, shipType, shipDirection, gameBoard) {
    // Check if it overflows
    let isVertical = false;
    if (shipDirection === "vertical") {
        isVertical = true;
    } else if (shipDirection === "horizontal") {
        isVertical = false;
    } else {
        isVertical = null;
    }
    let shipLength = lookUpShipSize(shipType + "-" + shipDirection);
    let verticalShipIsSmallEnough = !(isVertical && (y > (BOARD_SIZE - shipLength + 1)));
    let horizontalShipIsSmallEnough = !(!isVertical && (x > (BOARD_SIZE - shipLength + 1)));
    // Check if it overlaps
    let isOverlapping = false;
    for (let overlappingShip of gameBoard.getShips()) {
        if (checkOverlap(x, y, shipDirection, shipLength, overlappingShip.getX(), overlappingShip.getY(), overlappingShip.getDirection(), overlappingShip.getLength())) {
            isOverlapping = true;
        }
    }

    if (verticalShipIsSmallEnough && horizontalShipIsSmallEnough && !isOverlapping) {
        console.log(x + " " + y + " " + shipDirection);
        return true; // cooridnates are valid
    } else {
        return false; // coordinates are invalid
    }
}

function buildAttackBoard() {
    removeAllChildNodes(playerOneContainer);
    for (let i = 0; i <= BOARD_SIZE; i++) {
        for (let j = 0; j <= BOARD_SIZE; j++) {
            const square = document.createElement("div");
            if (i !== 0 && j !== 0) { // if we're not looking at the border
                square.classList.add("attack-square");
                // Add new event listeners that call GameBoard's recieveAttack
                square.addEventListener("click", function shootBoard() {
                    let isHit = playerTwoBoard.recieveAttack([j, i]);

                    if (isHit) {
                        // Add hit class so that the background is a hit marker
                        square.classList.add("hit");
                    } else {
                        // Add miss class so that the background is a miss token
                        square.classList.add("miss");
                    }

                    let allShipsSunk = playerTwoBoard.checkAllShipsSunk();
                    if (allShipsSunk) {
                        // Abort all event listeners
                        controller.abort();

                        battlePhaseContainer.style.display = "block";
                        // Display winner message
                        winnerText.innerText = "You have won!";
                        // Option to restart game
                        newGameBtn.disabled = false;
                    }
                }, { signal });
            }

            playerOneContainer.appendChild(square);
        }
    }
}

function vsPlayerAction() {

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}