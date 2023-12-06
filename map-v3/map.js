let usedCardIds = []; // To keep track of used card IDs

const cardWidth = 200; // width of a card in pixels
const cardHeight = 400; // height of a card in pixels
const cardSpacing = -2; // space between cards in pixels

let cardData = []; // Declare cardData in the global scope
let cardDetails = {};

async function loadCardData() {
  const response = await fetch("./cards.json");
  cardData = await response.json(); // Assign the fetched data to cardData
}

// Call loadCardData when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadCardData().then(() => {
    // You can initialize other elements or functions that depend on cardData here
    // For example:
    // initializeMap();
  });
});

function centerCardContainer() {
  var cardWrap = document.querySelector(".card-wrap");
  var cardContainer = document.getElementById("initialCard");

  // Calculate the center position
  var centerX = cardWrap.offsetWidth / 2 - cardWidth / 2;
  var centerY = cardWrap.offsetHeight / 2 - cardHeight / 2;
  console.log(cardWrap.offsetWidth);
  console.log(cardWrap.offsetHeight);
  console.log(centerX);
  console.log(centerY);

  cardContainer.style.left = centerX + "px";
  cardContainer.style.top = centerY + "px";
}

// Call this function on initial load and window resize
centerCardContainer();

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
    this.classList.remove("unknown-card", "panzoom-exclude");
    this.setAttribute("data-card-id", matchingCard.id);

    // Check and place new cards in adjacent positions
    placeNewCardIfEmpty(x, y - 1);
    placeNewCardIfEmpty(x + 1, y);
    placeNewCardIfEmpty(x, y + 1);
    placeNewCardIfEmpty(x - 1, y);
    usedCardIds.push(matchingCard.id);

    // Create a remove button and add it to the card
    var removeButton = document.createElement("button");
    removeButton.classList.add("remove-button", "hidden");
    removeButton.onclick = function () {
      removeCard(x, y);
    };
    this.appendChild(removeButton);

    applyRandomStyle(this); // Apply random style to the new card

    // Always generate new details when a card is turned over
    var cardId = parseInt(this.getAttribute("data-card-id"));
    var card = cardData.find((card) => card.id === cardId);

    if (card && card.details) {
      cardDetails[cardId] = {
        names: getRandomElement(card.details.names),
        descriptions: getRandomElement(card.details.descriptions),
        things: getRandomElement(card.details.things),
      };
    }

    // Remove invalid 'unknown' cards in adjacent positions
    removeInvalidUnknownCards(x, y);
  }

  addHoverListener(this);
}

// Function to get a random element from an array
function getRandomElement(arr) {
  if (arr && arr.length > 0) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  return null;
}

// Add hover event listener to show details in the sidebar
function addHoverListener(cardElement) {
  console.log("Adding hover listener to card"); // Check if the function is called
  cardElement.addEventListener("mouseover", function () {
    console.log("Hover event triggered"); // Check if hover event is triggered
    if (!this.classList.contains("unknown-card")) {
      var cardId = parseInt(this.getAttribute("data-card-id"));
      console.log("Hovered card ID: ", cardId); // Check the ID of the hovered card

      if (cardDetails[cardId]) {
        console.log("Details for hovered card: ", cardDetails[cardId]); // Check the details for the hovered card
        updateSidebar(cardDetails[cardId]);
      } else {
        console.log("No details found for card ID: ", cardId);
      }
    } else {
      console.log("Hovered on an unknown card, no action taken");
    }
  });
}

// Function to update specific elements with card details
function updateSidebar(details) {
  // Select each element by its ID
  var cardName = document.getElementById("cardName");
  var cardDescription = document.getElementById("cardDescription");
  var cardThing = document.getElementById("cardThing");

  // Update the content of each element
  cardName.textContent = details.names; // For text-only content
  cardDescription.innerHTML = details.descriptions; // Use innerHTML if you expect HTML content
  cardThing.innerHTML = details.things; // Use innerHTML if you expect HTML content
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

    // Forget the card's details
    delete cardDetails[cardId];

    // Create a new 'unknown' card in the removed card's position
    createNewUnknownCard(x, y);

    // Re-evaluate unknown cards after removal
    removeInvalidUnknownCards();
    reevaluateForUnknownCards();
  }
}

function applyRandomStyle(cardElement) {
  const rotation = (Math.random() - 0.5) * 2; // Random rotation between -5 and 5 degrees
  const shiftX = (Math.random() - 0.5) * 4; // Random horizontal shift between -2 and 2 pixels

  cardElement.style.transform = `rotate(${rotation}deg) translateX(${shiftX}px)`;
}

function createNewUnknownCard(x, y) {
  if (!document.querySelector(`[data-position="${x},${y}"]`)) {
    var newCard = document.createElement("div");
    newCard.classList.add("card", "unknown-card", "panzoom-exclude");
    newCard.style.position = "absolute";
    newCard.style.left = calculateLeftPosition(x) + "px"; // Use calculateLeftPosition
    newCard.style.top = calculateTopPosition(y) + "px"; // Use calculateTopPosition
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

    // Check if the card is adjacent to any known card and has a valid match
    if (
      !isAdjacentToKnownCard(checkX, checkY) ||
      findMatchingCard(checkX, checkY) === null
    ) {
      cardElem.remove(); // Remove the card if it's isolated or has no valid match
    }
  });
}

function isAdjacentToKnownCard(x, y) {
  // Check the four adjacent positions for a known card
  return (
    getCardData(x, y - 1) || // Top
    getCardData(x + 1, y) || // Right
    getCardData(x, y + 1) || // Bottom
    getCardData(x - 1, y) // Left
  );
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
  newCard.classList.add("card", "unknown-card", "panzoom-exclude");
  newCard.style.position = "absolute";
  newCard.style.left = calculateLeftPosition(x) + "px";
  newCard.style.top = calculateTopPosition(y) + "px";
  newCard.style.width = cardWidth + "px";
  newCard.style.height = cardHeight + "px";
  newCard.setAttribute("data-position", `${x},${y}`);

  addClickDetection(newCard);
  document.getElementById("cardContainer").appendChild(newCard);
}

function calculateLeftPosition(x) {
  var initialCard = document.getElementById("initialCard");
  var initialLeft = parseInt(initialCard.style.left, 10);
  return initialLeft + x * (cardWidth + cardSpacing);
}

function calculateTopPosition(y) {
  var initialCard = document.getElementById("initialCard");
  var initialTop = parseInt(initialCard.style.top, 10);
  return initialTop + y * (cardHeight + cardSpacing);
}
function reevaluateForUnknownCards() {
  const allCards = document.querySelectorAll(".card:not(.unknown-card)");
  allCards.forEach((cardElem) => {
    const position = cardElem
      .getAttribute("data-position")
      .split(",")
      .map(Number);
    const [x, y] = position;

    // Check and place new 'unknown' cards in adjacent positions
    placeNewCardIfEmpty(x, y - 1); // Top
    placeNewCardIfEmpty(x + 1, y); // Right
    placeNewCardIfEmpty(x, y + 1); // Bottom
    placeNewCardIfEmpty(x - 1, y); // Left
  });
}

// Initialize the first card (mapCard) and add click detection
var mapCard = document.querySelector(".card");
if (mapCard) {
  mapCard.setAttribute("data-position", "0,0");
  addClickDetection(mapCard);
  addHoverListener(mapCard); // Add hover listener to the initial card
}

// Panzoom

const elem = document.getElementById("cardContainer");
const panzoom = Panzoom(elem, {
  maxScale: 2,
  minScale: 0.5,
  step: 0.2,
  canvas: true,
  animate: true,
});

// Get references to the buttons
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");

// Attach event listeners
zoomInButton.addEventListener("click", panzoom.zoomIn);
zoomOutButton.addEventListener("click", panzoom.zoomOut);

elem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

// Import random

// import { onCardHover, updateSidebar } from './random.js';
