import { Player } from "./Player.js";

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

createGrid();
function createGrid() {
    for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10; j++) {
            const square = document.createElement("div");
            if (i !== 0 && j !== 0) { // if we're not looking at the border
                square.classList.add("square");
                square.addEventListener("click", (e) => {
                    
                })
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

        // Add green border to the clicked element
        selectedElement.style.border = '1px solid green';
    }
});

addVerticalShipsToBottom();
function addVerticalShipsToBottom() {
    removeAllChildNodes(shipsContainer);
    
    const patrolVertical = createShip("patrol-vertical", "Ships/patrol_vertical.png", "32px", "62px");
    shipsContainer.appendChild(patrolVertical);

    const destroyerVertical = createShip("destroyer-vertical", "Ships/destroyer_vertical.png", "32px", "93px");
    shipsContainer.appendChild(destroyerVertical);

    const submarineVertical = createShip("submarine-vertical", "Ships/submarine_vertical.png", "31px", "93px");
    shipsContainer.appendChild(submarineVertical);

    const battleshipVertical = createShip("battleship-vertical", "Ships/battleship_vertical.png", "31px", "125px");
    shipsContainer.appendChild(battleshipVertical);

    const carrierVertical = createShip("carrier-vertical", "Ships/carrier_vertical.png", "32px", "155px");
    shipsContainer.appendChild(carrierVertical);
}

function addHorizontalShipsToBottom() {
    removeAllChildNodes(shipsContainer);

    const patrolHorizontal = createShip("patrol-horizontal", "Ships/patrol_horizontal.png", "63px", "32px");
    shipsContainer.appendChild(patrolHorizontal);

    const destroyerHorizontal = createShip("destroyer-horizontal", "Ships/destroyer_horizontal.png", "93px", "32px");
    shipsContainer.appendChild(destroyerHorizontal);

    const submarineHorizontal = createShip("submarine-horizontal", "Ships/submarine_horizontal.png", "94px", "32px");
    shipsContainer.appendChild(submarineHorizontal);

    const battleshipHorizontal = createShip("battleship-horizontal", "Ships/battleship_horizontal.png", "124px", "32px");
    shipsContainer.appendChild(battleshipHorizontal);

    const carrierHorizontal = createShip("carrier-horizontal", "Ships/carrier_horizontal.png", "155px", "33px");
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
    ship.classList.add("select-ship");

    ship.addEventListener("click", (e) => {
        activeShip = ship;
        ship.style.border = "1px solid green";
    });
    return ship;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}