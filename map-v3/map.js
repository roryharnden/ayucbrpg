let usedCardIds = []; // To keep track of used card IDs

// Get the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const cardWidth = 200; // width of a card in pixels
const cardHeight = 400; // height of a card in pixels
const cardSpacing = 0; // space between cards in pixels

// Function to resize the canvas to fill the browser window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Resize the canvas to fill the browser window initially
resizeCanvas();

// Event listener to resize the canvas when the browser window is resized
window.addEventListener("resize", resizeCanvas);

function addClickDetection(cardElement) {
  cardElement.addEventListener("click", function () {
    // Check if the card is already revealed
    if (!this.classList.contains("unknown-card")) {
      console.log("Card already revealed, ignoring click.");
      return; // Exit the function if the card is already revealed
    }

    console.log("Card clicked and will be changed");
    changeCardBackground.call(this);
  });
}

function findMatchingCard(x, y) {
  const topCard = getCardData(x, y - 1);
  const rightCard = getCardData(x + 1, y);
  const bottomCard = getCardData(x, y + 1);
  const leftCard = getCardData(x - 1, y);

  let matchingCards = [];

  for (let card of cardData) {
    if (
      !usedCardIds.includes(card.id) &&
      (topCard === null || card.top === topCard.bottom) &&
      (rightCard === null || card.right === rightCard.left) &&
      (bottomCard === null || card.bottom === bottomCard.top) &&
      (leftCard === null || card.left === leftCard.right)
    ) {
      matchingCards.push(card);
    }
  }

  if (matchingCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchingCards.length);
    return matchingCards[randomIndex];
  }

  // Check if the position has been removed
  const removedPosition = document.querySelector(`[data-position="${x},${y}"]`);
  if (!removedPosition) {
    return null; // Skip this position if it has been removed
  }

  return null;
}

// Helper function to get the data of a card at a given position
function getCardData(x, y) {
  const cardElem = document.querySelector(`[data-position="${x},${y}"]`);
  if (cardElem && !cardElem.classList.contains("unknown-card")) {
    const cardId = parseInt(cardElem.getAttribute("data-card-id"));
    return cardData.find((card) => card.id === cardId);
  }
  return null;
}

function changeCardBackground() {
  var position = this.getAttribute("data-position").split(",").map(Number);
  var x = position[0];
  var y = position[1];

  // Find a matching card based on adjacent cards
  var matchingCard = findMatchingCard(x, y);
  if (matchingCard) {
    var imageUrl = "../map-v3/images/map_" + matchingCard.id + ".jpg";
    this.style.backgroundImage = 'url("' + imageUrl + '")';
    this.classList.remove("unknown-card"); // Remove unknown class
    this.setAttribute("data-card-id", matchingCard.id);

    // Remove 'unknown-card' and 'panzoom-exclude' classes
    this.classList.remove("unknown-card", "panzoom-exclude");

    // Check and place new cards in adjacent positions
    placeNewCardIfEmpty(x, y - 1); // Top
    placeNewCardIfEmpty(x + 1, y); // Right
    placeNewCardIfEmpty(x, y + 1); // Bottom
    placeNewCardIfEmpty(x - 1, y); // Left
    usedCardIds.push(matchingCard.id);

    // Create a remove button and add it to the card
    var removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove";
    removeButton.classList.add("remove-button", "hidden");
    removeButton.onclick = function () {
      removeCard(x, y);
    };
    this.appendChild(removeButton);

    // Remove invalid 'unknown' cards in adjacent positions
    removeInvalidUnknownCards(x, y);
  }
}

function removeCard(x, y) {
  const cardElem = document.querySelector(`[data-position="${x},${y}"]`);
  if (cardElem) {
    // Get the card's ID and remove it from usedCardIds
    const cardId = parseInt(cardElem.getAttribute("data-card-id"));
    const index = usedCardIds.indexOf(cardId);
    if (index > -1) {
      usedCardIds.splice(index, 1);
    }

    // Remove the card element
    cardElem.remove();

    // Create a new 'unknown' card in the removed card's position
    createNewUnknownCard(x, y);

    // Re-evaluate unknown cards after removal
    removeInvalidUnknownCards();
  }
}

function createNewUnknownCard(x, y) {
  if (!document.querySelector(`[data-position="${x},${y}"]`)) {
    var newCard = document.createElement("div");
    newCard.classList.add("card", "unknown-card", "panzoom-exclude");
    newCard.style.position = "absolute";
    newCard.style.left = x * (cardWidth + cardSpacing) + "px";
    newCard.style.top = y * (cardHeight + cardSpacing) + "px";
    newCard.style.width = cardWidth + "px";
    newCard.style.height = cardHeight + "px";
    newCard.setAttribute("data-position", `${x},${y}`);

    addClickDetection(newCard);
    document.getElementById("cardContainer").appendChild(newCard);
  }
}

function removeInvalidUnknownCards() {
  const unknownCards = document.querySelectorAll(".unknown-card");
  unknownCards.forEach((cardElem) => {
    const position = cardElem
      .getAttribute("data-position")
      .split(",")
      .map(Number);
    const [checkX, checkY] = position;

    if (findMatchingCard(checkX, checkY) === null) {
      cardElem.remove(); // Remove the card if no valid match is found
    }
  });
}

function placeNewCardIfEmpty(x, y) {
  var existingCard = document.querySelector(`[data-position="${x},${y}"]`);
  if (!existingCard) {
    // Check if there's a possible matching card before creating a new one
    if (findMatchingCard(x, y) !== null) {
      createNewCard(x, y);
    } else {
      console.log(`No matching cards available for position ${x}, ${y}`);
    }
  }
}

function createNewCard(x, y) {
  var newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.classList.add("unknown-card");
  newCard.classList.add("panzoom-exclude");
  newCard.style.position = "absolute";
  newCard.style.left = x * (cardWidth + cardSpacing) + "px";
  newCard.style.top = y * (cardHeight + cardSpacing) + "px";
  newCard.style.width = cardWidth + "px";
  newCard.style.height = cardHeight + "px";
  newCard.setAttribute("data-position", `${x},${y}`);

  addClickDetection(newCard);
  document.getElementById("cardContainer").appendChild(newCard);
}

// Initialize the first card (mapCard) and add click detection
var mapCard = document.querySelector(".card");
if (mapCard) {
  mapCard.setAttribute("data-position", "0,0");
  addClickDetection(mapCard);
}

// Panzoom

const elem = document.getElementById("cardContainer");
const panzoom = Panzoom(elem, {
  maxScale: 1,
  minScale: 0.5,

  canvas: true,
});
setTimeout(() => panzoom.pan(0, 0)), panzoom.zoom(1, { animate: true });

elem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

let cardData = [
  { id: 1, top: "water", right: "land", bottom: "water", left: "land" },
  { id: 2, top: "water", right: "land", bottom: "land", left: "land" },
  { id: 3, top: "land", right: "land", bottom: "water", left: "land" },
  { id: 4, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 5, top: "land", right: "water", bottom: "land", left: "land" },
  { id: 6, top: "water", right: "water", bottom: "water", left: "water" },
  { id: 7, top: "land", right: "water", bottom: "water", left: "water" },
  { id: 8, top: "water", right: "land", bottom: "land", left: "water" },
  { id: 9, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 10, top: "water", right: "water", bottom: "water", left: "water" },
  { id: 11, top: "land", right: "water", bottom: "land", left: "water" },
  { id: 12, top: "water", right: "water", bottom: "water", left: "water" },
  { id: 13, top: "land", right: "land", bottom: "land", left: "water" },
  { id: 14, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 15, top: "water", right: "water", bottom: "water", left: "land" },
  { id: 16, top: "water", right: "water", bottom: "water", left: "water" },
  { id: 17, top: "land", right: "land", bottom: "land", left: "water" },
  { id: 18, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 19, top: "water", right: "land", bottom: "land", left: "land" },
  { id: 20, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 21, top: "water", right: "land", bottom: "land", left: "land" },
  { id: 22, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 23, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 24, top: "water", right: "land", bottom: "land", left: "land" },
  { id: 25, top: "water", right: "land", bottom: "water", left: "land" },
  { id: 26, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 27, top: "land", right: "land", bottom: "water", left: "land" },
  { id: 28, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 29, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 30, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 31, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 32, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 33, top: "land", right: "water", bottom: "land", left: "land" },
  { id: 34, top: "water", right: "land", bottom: "land", left: "water" },
  { id: 35, top: "land", right: "water", bottom: "land", left: "land" },
  { id: 36, top: "water", right: "land", bottom: "land", left: "water" },
  { id: 37, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 38, top: "land", right: "land", bottom: "water", left: "land" },
  { id: 39, top: "land", right: "water", bottom: "water", left: "land" },
  { id: 40, top: "land", right: "land", bottom: "land", left: "water" },
  { id: 41, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 42, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 43, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 44, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 45, top: "land", right: "land", bottom: "water", left: "land" },
  { id: 46, top: "land", right: "water", bottom: "water", left: "water" },
  { id: 47, top: "water", right: "water", bottom: "water", left: "water" },
  { id: 48, top: "water", right: "land", bottom: "land", left: "water" },
  { id: 49, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 50, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 51, top: "land", right: "land", bottom: "water", left: "land" },
  { id: 52, top: "land", right: "land", bottom: "land", left: "land" },
  { id: 53, top: "land", right: "water", bottom: "water", left: "land" },
  { id: 54, top: "water", right: "land", bottom: "land", left: "water" },
];
