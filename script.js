// import { create } from "yallist";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";

const OCEAN_URL = "oceangrid_final.png";
const RADAR_URL = "radargrid_final.png";
const BOARD_SIZE = 10;

const upperPlayerContainer = document.getElementById("upper-player-container");
const lowerPlayerContainer = document.getElementById("lower-player-container");
const vsPhaseContainer = document.getElementById("vs-phase")
const gamePhaseContainer = document.getElementById("game-phase");
const choosingPhaseContainer = document.getElementById("choosing-phase");
const battlePhaseContainer = document.getElementById("battle-phase");
const shipsContainer = document.getElementById("ships");
const medianScreenContainer = document.getElementById("median-screen");

const vsComputerBtn = document.getElementById("play-vs-computer-btn");
const vsPlayerBtn = document.getElementById("play-vs-player-btn");
const switchDirectionsBtn = document.getElementById("switch-directions-btn");
const confirmPlacementBtn = document.getElementById("confirm-placement-btn");
confirmPlacementBtn.disabled = true;
const newGameBtn = document.getElementById("new-game-btn");
newGameBtn.disabled = true;
const passReadyBtn = document.getElementById("pass-ready-btn");

const winnerText = document.getElementById("winner-text");
const playersTurnText = document.getElementById("players-turn-text");

let verticalDirection = true; // true if vertical, false if horizontal. used when placing ships
let activeShip;
let gameType; // "computer" if vs comptuer, "player" if vs player

let playerOne = new Player();
let playerTwo = new Player();
let playerOneBoard = playerOne.getGameboard();
let playerTwoBoard = playerTwo.getGameboard();

newGameBtn.addEventListener("click", (e) => {
    location.reload();
})

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
    createStartingGrid(upperPlayerContainer);
});

vsPlayerBtn.addEventListener("click", (e) => {
    gameType = "player";
    confirmPlacementAction = vsPlayerAction;

    // Unveil the game-phase stuff
    gamePhaseContainer.style.display = "flex";
    gamePhaseContainer.style.flexDirection = "column";
    gamePhaseContainer.style.alignItems = "center";

    // Hide the vs-phase stuff
    vsPhaseContainer.style.display = "none";

    // Let them choose their ships
    createStartingGrid(upperPlayerContainer);
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
                            const newShip = createShipForBoardOverlay(newShipID, imageURL, width, height);
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
    
    const patrolVertical = createShipForBottom("patrol-vertical", "Ships/patrol_vertical.png", "32px", "62px");
    shipsContainer.appendChild(patrolVertical);

    const destroyerVertical = createShipForBottom("destroyer-vertical", "Ships/destroyer_vertical.png", "32px", "93px");
    shipsContainer.appendChild(destroyerVertical);

    const submarineVertical = createShipForBottom("submarine-vertical", "Ships/submarine_vertical.png", "31px", "93px");
    shipsContainer.appendChild(submarineVertical);

    const battleshipVertical = createShipForBottom("battleship-vertical", "Ships/battleship_vertical.png", "31px", "125px");
    shipsContainer.appendChild(battleshipVertical);

    const carrierVertical = createShipForBottom("carrier-vertical", "Ships/carrier_vertical.png", "32px", "155px");
    shipsContainer.appendChild(carrierVertical);
}

function addHorizontalShipsToBottom() {
    removeAllChildNodes(shipsContainer);

    const patrolHorizontal = createShipForBottom("patrol-horizontal", "Ships/patrol_horizontal.png", "63px", "32px");
    shipsContainer.appendChild(patrolHorizontal);

    const destroyerHorizontal = createShipForBottom("destroyer-horizontal", "Ships/destroyer_horizontal.png", "93px", "32px");
    shipsContainer.appendChild(destroyerHorizontal);

    const submarineHorizontal = createShipForBottom("submarine-horizontal", "Ships/submarine_horizontal.png", "94px", "32px");
    shipsContainer.appendChild(submarineHorizontal);

    const battleshipHorizontal = createShipForBottom("battleship-horizontal", "Ships/battleship_horizontal.png", "124px", "32px");
    shipsContainer.appendChild(battleshipHorizontal);

    const carrierHorizontal = createShipForBottom("carrier-horizontal", "Ships/carrier_horizontal.png", "155px", "33px");
    shipsContainer.appendChild(carrierHorizontal);
}

/**
 * Create a ship
 * @param {String} id is the id of the element
 * @param {String} imageURL is the url of the image
 * @param {String} width is the width of the image. Must include "px"
 * @param {String} height is the height of the image. Must include "px"
 * @returns a div with the background as the imageURL and size width x height
*/
function createShip(id, imageURL, width, height) {
    const ship = document.createElement("div");
    ship.id = id;
    ship.style.backgroundImage = `url('${imageURL}')`;
    ship.style.width = width;
    ship.style.height = height;
    return ship;
}

/**
 * Create a ship to be used at the bottom of the page when placing ships
 * @param {String} id is the id of the element
 * @param {String} imageURL is the url of the image
 * @param {String} width is the width of the image. Must include "px"
 * @param {String} height is the height of the image. Must include "px"
 * @returns a div with the background as the imageURL, size "width x height", and an event listener which changes the active ship 
*/
// function createShipForBottom(id, direction, imageURL, width, height) {
function createShipForBottom(id, imageURL, width, height) {
    const ship = createShip(id, imageURL, width, height);
    ship.classList.add("select-ship");

    ship.addEventListener("click", (e) => {
        activeShip = ship;
        ship.style.border = "1px solid green";
    });
    return ship;
}

/**
 * Create a ship to be used on the board when placing ships
 * @param {String} id is the id of the element
 * @param {String} imageURL is the url of the image
 * @param {String} width is the width of the image. Must include "px"
 * @param {String} height is the height of the image. Must include "px"
 * @returns a div with the background as the imageURL, size "width x height"
*/
function createShipForBoardOverlay(id, imageURL, width, height) {
    const ship = createShip(id, imageURL, width, height);
    
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

    upperPlayerContainer.style.backgroundImage = "url(" + RADAR_URL + ")";
    // Start attacking
    // Remove all squares and replace with new squares
    buildAttackBoardVsComputer();
    // Build lower player display
    buildLowerDisplayBoard(playerOneBoard);
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
            let shipURL = shipElement.style.backgroundImage.slice(5, -2);

            let isVertical = false;
            if (shipDirection === "vertical") {
                isVertical = true;
            } else if (shipDirection === "horizontal") {
                isVertical = false;
            }

            gameBoard.placeShip([x, y], isVertical, shipSize, shipType, [shipURL, shipElement.style.width, shipElement.style.height]);
        }
    }
}

/**
 * Randomly places the 5 ships on a GameBoard
 * @param {GameBoard} gameBoard is the GameBoard ships are placed on
 */
function placeShipsRandomly(gameBoard) {
    let shipType = "patrol";
    let randomCoordinatesAndDirection = generateRandomCoordinatesForShip(shipType, gameBoard);
    let shipImgInfo = lookupImgInfo(shipType, randomCoordinatesAndDirection[1]);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType), shipType, shipImgInfo);

    shipType = "destroyer";
    randomCoordinatesAndDirection = generateRandomCoordinatesForShip(shipType, gameBoard);
    shipImgInfo = lookupImgInfo(shipType, randomCoordinatesAndDirection[1]);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType), shipType, shipImgInfo);

    shipType = "submarine";
    randomCoordinatesAndDirection = generateRandomCoordinatesForShip(shipType, gameBoard);
    shipImgInfo = lookupImgInfo(shipType, randomCoordinatesAndDirection[1]);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType), shipType, shipImgInfo);

    shipType = "battleship";
    randomCoordinatesAndDirection = generateRandomCoordinatesForShip(shipType, gameBoard);
    shipImgInfo = lookupImgInfo(shipType, randomCoordinatesAndDirection[1]);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType), shipType, shipImgInfo);

    shipType = "carrier";
    randomCoordinatesAndDirection = generateRandomCoordinatesForShip(shipType, gameBoard);
    shipImgInfo = lookupImgInfo(shipType, randomCoordinatesAndDirection[1]);
    gameBoard.placeShip(randomCoordinatesAndDirection[0], randomCoordinatesAndDirection[1], lookUpShipSize(shipType), shipType, shipImgInfo);
}

function lookupImgInfo(shipType, shipDirection) {
    let fullShipRequest = shipType + "-";
    if (shipDirection === true || shipDirection === "vertical") {
        fullShipRequest += "vertical";
    } else if (shipDirection === false || shipDirection === "horizontal") {
        fullShipRequest += "horizontal";
    }

    let shipInfo;
    switch (fullShipRequest) {
        case "patrol-vertical":
            shipInfo = ["Ships/patrol_vertical.png", "32px", "62px"];
            break;
        case "submarine-vertical":
            shipInfo = ["Ships/submarine_vertical.png", "31px", "93px"];
            break;
        case "destroyer-vertical":
            shipInfo = ["Ships/destroyer_vertical.png", "32px", "93px"];
            break;
        case "battleship-vertical":
            shipInfo = ["Ships/battleship_vertical.png", "31px", "125px"];
            break;
        case "carrier-vertical":
            shipInfo = ["Ships/carrier_vertical.png", "32px", "155px"];
            break;
        case "patrol-horizontal":
            shipInfo = ["Ships/patrol_horizontal.png", "63px", "32px"];
            break;
        case "destroyer-horizontal":
            shipInfo = ["Ships/destroyer_horizontal.png", "93px", "32px"];
            break;
        case "submarine-horizontal":
            shipInfo = ["Ships/submarine_horizontal.png", "94px", "32px"];
            break;
        case "battleship-horizontal":
            shipInfo = ["Ships/battleship_horizontal.png", "124px", "32px"];
            break;
        case "carrier-horizontal":
            shipInfo = ["Ships/carrier_horizontal.png", "155px", "33px"];
            break;
    }

    return shipInfo;
}

function generateRandomCoordinatesForShip(shipType, gameBoard) {
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

/**
 * Adds squares to the upperPlayerContainer that send hits to the playerTwoBoard
 * and check if all ships are sunk when clicked on.
 */
function buildAttackBoardVsComputer() {
    removeAllChildNodes(upperPlayerContainer);
    for (let i = 0; i <= BOARD_SIZE; i++) {
        for (let j = 0; j <= BOARD_SIZE; j++) {
            const square = document.createElement("div");
            if (i !== 0 && j !== 0) { // if we're not looking at the border
                square.classList.add("attack-square");
                // Add new event listeners that call GameBoard's recieveAttack
                square.addEventListener("click", function shootBoard() {
                    if (!square.children[0]) { // This line prevents multiple attack events on one square
                        let isHit = playerTwoBoard.recieveAttack([j, i]);
    
                        if (isHit) {
                            // Create a hit element and append it to this square
                            let tokenSquare = document.createElement("div");
                            tokenSquare.classList.add("hit");
                            square.appendChild(tokenSquare);
                        } else {
                            // Create a miss element and append it to this square
                            let tokenSquare = document.createElement("div");
                            tokenSquare.classList.add("miss");
                            square.appendChild(tokenSquare);
                        }
    
                        let playerTwoAllShipsSunk = playerTwoBoard.checkAllShipsSunk();
                        if (playerTwoAllShipsSunk) {
                            // Abort all event listeners
                            controller.abort();
    
                            battlePhaseContainer.style.display = "block";
                            // Display winner message
                            winnerText.innerText = "You have won!";
                            // Option to restart game
                            newGameBtn.disabled = false;
                        }
    
                        // Computers turn
                        computerAttackPlayerBoard(playerOneBoard);
                        let playerOneAllShipsSunk = playerOneBoard.checkAllShipsSunk();
                        if (playerOneAllShipsSunk && !playerTwoAllShipsSunk) {
                            // Abort all event listeners
                            controller.abort();
    
                            battlePhaseContainer.style.display = "block";
                            // Display winner message
                            winnerText.innerText = "You have lost!";
                            // Option to restart game
                            newGameBtn.disabled = false;
                        }
                    }
                }, { signal });
            }

            upperPlayerContainer.appendChild(square);
        }
    }
}

function computerAttackPlayerBoard(gameBoard) {
    // Generate a new shot
    let shot = generateRandomShot(gameBoard);
    
    // Shoot the GameBoard
    let isHit = gameBoard.recieveAttack(shot);

    // Update the lower player container
    shootLowerPlayerContainer(shot, isHit);
}

/**
 * Generates a random shot that has not been fired on this GameBoard yet
 * @param {GameBoard} gameBoard is the GameBoard who the shot is being fired on
 * @returns an array of coordinates [x, y]
 */
function generateRandomShot(gameBoard) {
    let x = Math.floor(Math.random() * 10) + 1;
    let y = Math.floor(Math.random() * 10) + 1;
    while (gameBoard.checkIfShotAlreadyMade([x, y])) {
        x = Math.floor(Math.random() * 10) + 1;
        y = Math.floor(Math.random() * 10) + 1;
    }
    
    return [x, y];
}

function shootLowerPlayerContainer(shot, isHit) {
    let currentChild = 0;
    for (let i = 0; i <= BOARD_SIZE; i++) {
        for (let j = 0; j <= BOARD_SIZE; j++) {
            if (GameBoard.compareArrays(shot, [j, i])) {
                let shotToken = document.createElement("div");
                if (isHit) {
                    shotToken.classList.add("hit");
                } else {
                    shotToken.classList.add("miss");
                }
                // shotToken.style.height = "30px";
                lowerPlayerContainer.children[currentChild].appendChild(shotToken);
            }

            currentChild++;
        }
    }
}

/**
 * Displays ships on the lower board
 */
function buildLowerDisplayBoard(playerBoard) {
    lowerPlayerContainer.style.display = "grid";
    lowerPlayerContainer.style.gap = ".5px";
    lowerPlayerContainer.style.gridTemplateColumns = "repeat(11, 30.6px)";
    lowerPlayerContainer.style.gridTemplateRows = "repeat(11, 30.6px)";
    lowerPlayerContainer.style.width = "342px";
    lowerPlayerContainer.style.height = "342px";
    lowerPlayerContainer.style.backgroundImage = "url(" + OCEAN_URL + ")";

    removeAllChildNodes(lowerPlayerContainer);

    // Add divs to the grid
    for (let i = 0; i <= BOARD_SIZE; i++) {
        for (let j = 0; j <= BOARD_SIZE; j++) {
            const square = document.createElement("div");
            if (i !== 0 && j !== 0) {
                square.classList.add("lower-display-square");
            }
            lowerPlayerContainer.appendChild(square);
        }
    }

    for (let ship of playerBoard.getShips()) {
        const newShip = createShip(ship.getShipType(), ship.getURL(), ship.getImgWidth(), ship.getImgHeight());
        newShip.classList.add("lower-player-container-ship");
        // Loop through the squares to place the ship
        let currentChild = 0;
        for (let i = 0; i <= BOARD_SIZE; i++) {
            for (let j = 0; j <= BOARD_SIZE; j++) {
                if (GameBoard.compareArrays(ship.getCoordinates(), [j, i])) {
                    lowerPlayerContainer.children[currentChild].appendChild(newShip);
                    break;
                }

                currentChild++;
            }
        }
    }
}

function vsPlayerAction() {
    // Add all pieces to a GameBoard
    addShipsToGameBoard(playerOneBoard);

    // Recreate the starting grid
    createStartingGrid(upperPlayerContainer);

    // Disable "confirm ship placements" button
    confirmPlacementBtn.disabled = true;

    // Change "confirm ship placements" action
    confirmPlacementAction = vsPlayerActionTwo;
}

function vsPlayerActionTwo() {
    // Add all pieces to a GameBoard
    addShipsToGameBoard(playerTwoBoard);

    // Hide the choosing phase container (ships)
    choosingPhaseContainer.style.display = "none";

    // Set the background image of the upper container to radar
    upperPlayerContainer.style.backgroundImage = "url(" + RADAR_URL + ")";

    // Start attacking
    vsPlayerGameLoop();
}

// Promise for clicking a square on the board
let squareClickedPromise;
function waitForSquareClick() {
    return new Promise(resolve => {
        squareClickedPromise = resolve;
    });
}

// Promise for clicking the median screen
let medianClickedPromise;
function waitForMedianClick() {
    return new Promise(resolve => {
        medianClickedPromise = resolve;
    });
}

async function vsPlayerGameLoop() {
    let playerOneAllShipsSunk = false;
    let playerTwoAllShipsSunk = false;
    let isPlayerOnesTurn = true;

    while (!playerOneAllShipsSunk && !playerTwoAllShipsSunk) {
        if (isPlayerOnesTurn) {
            playersTurnText.innerText = "Player one's turn";
            buildAttackBoardVsPlayer(playerTwoBoard);
            buildLowerDisplayBoard(playerOneBoard);
        } else {
            playersTurnText.innerText = "Player two's turn";
            buildAttackBoardVsPlayer(playerOneBoard);
            buildLowerDisplayBoard(playerTwoBoard);
        }

        await waitForSquareClick();

        playerOneAllShipsSunk = playerOneBoard.checkAllShipsSunk();
        playerTwoAllShipsSunk = playerTwoBoard.checkAllShipsSunk();
        
        if (playerOneAllShipsSunk) {
            winnerText.innerText = "Player two wins!";
        }
        if (playerTwoAllShipsSunk) {
            winnerText.innerText = "Player one wins!";
        }
        if (playerOneAllShipsSunk || playerTwoAllShipsSunk) {
            controller.abort();
            battlePhaseContainer.style.display = "block";
            newGameBtn.disabled = false;
            break;        
        }
        
        // Put up the median screen and wait for median screen button to be clicked
        buildMedianScreen();
        await waitForMedianClick();
        isPlayerOnesTurn = !isPlayerOnesTurn;
    }
}

function buildMedianScreen() {
    medianScreenContainer.style.display = "flex";
    medianScreenContainer.style.flexDirection = "column";
    medianScreenContainer.style.alignItems = "center";

    gamePhaseContainer.style.display = "none";

    passReadyBtn.addEventListener("click", (e) => {
        gamePhaseContainer.style.display = "flex";
        medianScreenContainer.style.display = "none";
        medianClickedPromise();
    })
}

/**
 * Builds the attack board (upper player container)
 * @param {GameBoard} gameBoard is the GameBoard being shot at
 */
function buildAttackBoardVsPlayer(gameBoard) {
    removeAllChildNodes(upperPlayerContainer);
    for (let i = 0; i <= BOARD_SIZE; i++) {
        for (let j = 0; j <= BOARD_SIZE; j++) {
            const square = document.createElement("div");
            if (i !== 0 && j !== 0) { // if we're not looking at the border
                square.classList.add("attack-square");
                // Add new event listeners that call GameBoard's recieveAttack
                square.addEventListener("click", function shootBoard() {
                    if (!square.children[0]) { // This line prevents multiple attack events on one square
                        gameBoard.recieveAttack([j, i]);
                    }

                    squareClickedPromise();
                }, { signal });

                // If this square has a token, add it as a child
                if (gameBoard.checkIfShotAlreadyMade([j, i])) {
                    if (gameBoard.getShotTypeAtCoordinates([j, i]) === "hit") {
                        // Create a hit element and append it to this square
                        let tokenSquare = document.createElement("div");
                        tokenSquare.classList.add("hit");
                        square.appendChild(tokenSquare);
                    } else if (gameBoard.getShotTypeAtCoordinates([j, i]) === "miss") {
                        // Create a miss element and append it to this square
                        let tokenSquare = document.createElement("div");
                        tokenSquare.classList.add("miss");
                        square.appendChild(tokenSquare);
                    }
                }
            }
            upperPlayerContainer.appendChild(square);
        }
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}