let usedCardIds = []; // To keep track of used card IDs
let currentHoveredCardId = null;

const cardWidth = 300; // width of a card in pixels
const cardHeight = 600; // height of a card in pixels
const cardSpacing = -2; // space between cards in pixels

let cardData = []; // Declare cardData in the global scope
let cardDetails = {};

async function loadCardData() {
  const response = await fetch("./cards.json");
  cardData = await response.json(); // Assign the fetched data to cardData
}

// Call loadCardData when the document is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await loadCardData(); // Make sure card data is loaded

  const urlParams = new URLSearchParams(window.location.search);
  const compressedState = urlParams.get("state");
  if (compressedState) {
    reconstructMapFromCompressedState(compressedState);
  } else {
    // Flip the initial card if no compressed state is found
    var mapCard = document.querySelector(".card");
    if (mapCard) {
      changeCardBackground.call(mapCard);
    }
  }
  document.getElementById("explore").addEventListener("click", function () {
    console.log("Explore button clicked");

    var currentCardId = getCurrentCardId();
    console.log("Current Card ID:", currentCardId);

    if (currentCardId && cardDetails[currentCardId]) {
      console.log("Card Details before exploring:", cardDetails[currentCardId]);
      cardDetails[currentCardId].explored = true;
      updateSidebar(currentCardId);
      console.log("Card explored:", cardDetails[currentCardId]);
    } else {
      console.log("No valid card found or already explored");
    }
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
    var imageUrl = "./images/map_" + matchingCard.id + ".jpg";
    this.style.backgroundImage = 'url("' + imageUrl + '")';
    this.classList.remove("unknown-card", "panzoom-exclude");
    this.setAttribute("data-card-id", matchingCard.id);

    // Check and place new cards in adjacent positions
    placeNewCardIfEmpty(x, y - 1);
    placeNewCardIfEmpty(x + 1, y);
    placeNewCardIfEmpty(x, y + 1);
    placeNewCardIfEmpty(x - 1, y);
    usedCardIds.push(matchingCard.id);

    // Create a remove button and add it to the card, except for the initial card
    if (this.getAttribute("id") !== "initialCard") {
      var removeButton = document.createElement("button");
      removeButton.classList.add("remove-button", "hidden");
      removeButton.textContent = ""; // Add appropriate text/icon
      removeButton.onclick = function () {
        removeCard(x, y);
      };
      this.appendChild(removeButton);
    }

    applyRandomStyle(this); // Apply random style to the new card

    // Always generate new details when a card is turned over
    var cardId = parseInt(this.getAttribute("data-card-id"));
    var card = cardData.find((card) => card.id === cardId);

    if (card && card.details) {
      const nameIndex = getRandomIndex(card.details.names);
      const descriptionIndex = getRandomIndex(card.details.descriptions);
      const thingsIndex = getRandomIndex(card.details.things);

      cardDetails[cardId] = {
        nameIndex: nameIndex,
        descriptionIndex: descriptionIndex,
        thingsIndex: thingsIndex,
        explored: false,
      };
    }

    // Remove invalid 'unknown' cards in adjacent positions
    removeInvalidUnknownCards(x, y);
    currentHoveredCardId = cardId;
    updateSidebar(cardId);
  }

  addHoverListener(this);
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
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
  let hoverTimeout;

  cardElement.addEventListener("mouseover", function () {
    // Clear any existing timeout to reset the timer
    clearTimeout(hoverTimeout);

    // Set a new timeout
    hoverTimeout = setTimeout(() => {
      if (!this.classList.contains("unknown-card")) {
        var cardId = parseInt(this.getAttribute("data-card-id"));
        console.log("Hovered over card ID:", cardId); // Debugging line

        // Only update the sidebar if this is a different card
        if (cardId !== currentHoveredCardId) {
          currentHoveredCardId = cardId; // Update the global variable
          if (cardDetails[cardId]) {
            updateSidebar(cardId);
          }
        }
      }
    }, 250); // Delay before activating hover
  });

  cardElement.addEventListener("mouseout", function () {
    // Clear the timeout
    clearTimeout(hoverTimeout);
  });
}

function removeHoveredClassFromAllCards() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.classList.remove("current-card");
  });
}

function updateSidebar(cardId) {
  const cardDetail = cardDetails[cardId];
  console.log("Updating sidebar for card ID:", cardId, cardDetail); // Debugging line

  if (cardDetail) {
    const cardDetailData = cardData.find(
      (card) => card.id === parseInt(cardId)
    ).details;

    removeHoveredClassFromAllCards();

    const currentCardElement = document.querySelector(
      `.card[data-card-id="${cardId}"]`
    );
    if (currentCardElement) {
      currentCardElement.classList.add("current-card");
      applyRandomStyle(currentCardElement);
    }

    if (cardDetailData) {
      var cardName = document.getElementById("cardName");
      var cardDescription = document.getElementById("cardDescription");
      var cardThing = document.getElementById("cardThing");
      var cardThingWrap = document.getElementById("cardThingWrap");
      var exploreButton = document.getElementById("explore");

      // Access the indices using the new object properties
      cardName.textContent = cardDetailData.names[cardDetail.nameIndex];
      cardDescription.innerHTML =
        cardDetailData.descriptions[cardDetail.descriptionIndex];

      // Handle the visibility of cardThing and text of exploreButton
      if (cardDetail.explored) {
        cardThing.innerHTML = cardDetailData.things[cardDetail.thingsIndex];
        cardThing.style.display = "block"; // Show cardThing if explored
        exploreButton.textContent = "Explored"; // Change button text
        cardThingWrap.classList.add("explored");
      } else {
        cardThing.style.display = "none"; // Hide cardThing if not explored
        exploreButton.textContent = "Explore"; // Change button text
        cardThingWrap.classList.remove("explored");
      }
    }
  } else {
    console.error("No details found for card ID:", cardId); // Error log
  }
}

function getCurrentCardId() {
  return currentHoveredCardId;
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
    reevaluateForUnknownCards();
    removeInvalidUnknownCards();
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
    placeUnknownCardIfEmpty(x, y - 1); // Top
    placeUnknownCardIfEmpty(x + 1, y); // Right
    placeUnknownCardIfEmpty(x, y + 1); // Bottom
    placeUnknownCardIfEmpty(x - 1, y); // Left
  });
}

function placeUnknownCardIfEmpty(x, y) {
  if (!document.querySelector(`[data-position="${x},${y}"]`)) {
    createNewUnknownCard(x, y);
  }
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

// URL

function encodeCardState() {
  let encodedState = [];

  document.querySelectorAll(".card:not(.unknown-card)").forEach((card) => {
    const position = card.getAttribute("data-position");
    const cardId = card.getAttribute("data-card-id");
    const cardDetail = cardDetails[cardId];

    if (position && cardId && cardDetail) {
      // Include the explored status in the encoding
      encodedState.push(
        `${position},${cardId},${cardDetail.nameIndex}${
          cardDetail.descriptionIndex
        }${cardDetail.thingsIndex},${cardDetail.explored ? "1" : "0"}`
      );
    } else {
      console.error("Invalid card details for card ID:", cardId);
    }
  });

  return encodedState.join("|");
}

function createShareableLink() {
  const encodedState = encodeCardState();
  const baseUrl = window.location.href.split("?")[0];
  return baseUrl + "?state=" + encodedState;
}

function reconstructMapFromCompressedState(compressedState) {
  cardDetails = {};
  usedCardIds = []; // Reset the usedCardIds array

  const cardStates = compressedState.split("|");

  cardStates.forEach((state) => {
    const [x, y, cardId, detailString, exploredString] = state.split(",");

    const nameIndex = parseInt(detailString.charAt(0));
    const descriptionIndex = parseInt(detailString.charAt(1));
    const thingsIndex = parseInt(detailString.charAt(2));
    const explored = exploredString === "1";

    // Use indices and explored status to set the details of the card
    cardDetails[cardId] = {
      nameIndex: nameIndex,
      descriptionIndex: descriptionIndex,
      thingsIndex: thingsIndex,
      explored: explored,
    };

    placeCardAt(x, y, cardId, [nameIndex, descriptionIndex, thingsIndex]);
    usedCardIds.push(parseInt(cardId)); // Add the card ID to the list of used cards
  });

  var initialCardId = document
    .getElementById("initialCard")
    .getAttribute("data-card-id");
  if (initialCardId) {
    currentHoveredCardId = parseInt(initialCardId);
    updateSidebar(currentHoveredCardId);
  }

  reevaluateForUnknownCards(); // Optionally reevaluate for adding new unknown cards if needed
  removeInvalidUnknownCards(); // Remove invalid 'unknown' cards
}

document.getElementById("shareButton").addEventListener("click", function () {
  const shareableLink = createShareableLink();

  // Fallback method for copying text
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }

  // Try using Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        console.log("Link copied to clipboard successfully!");
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
        // Fallback for browsers where clipboard API is not available
        fallbackCopyTextToClipboard(shareableLink);
      });
  } else {
    // Use fallback method directly if Clipboard API is not available
    fallbackCopyTextToClipboard(shareableLink);
  }
});

function placeCardAt(x, y, cardId, detailIndices) {
  // Find or create a new card element
  let cardSelector = `[data-position="${x},${y}"]`;
  let card = document.querySelector(cardSelector);

  let isNewCard = false;
  if (!card) {
    card = document.createElement("div");
    isNewCard = true;
  }

  // Set card attributes and styles
  card.classList.add("card");
  card.classList.remove("unknown-card", "panzoom-exclude");
  card.style.position = "absolute";
  card.style.left = calculateLeftPosition(x) + "px";
  card.style.top = calculateTopPosition(y) + "px";
  card.style.width = cardWidth + "px";
  card.style.height = cardHeight + "px";
  card.setAttribute("data-position", `${x},${y}`);
  card.setAttribute("data-card-id", cardId);

  // Set the card's background image
  var imageUrl = `./images/map_${cardId}.jpg`;
  card.style.backgroundImage = `url("${imageUrl}")`;

  console.log("Placing card at", x, y, "with details", detailIndices); // Debug log

  let isExplored = cardDetails[cardId]?.explored ?? false;

  cardDetails[cardId] = {
    nameIndex: detailIndices[0],
    descriptionIndex: detailIndices[1],
    thingsIndex: detailIndices[2],
    explored: isExplored, // or true, based on your logic
  };

  // Add click and hover listeners
  addClickDetection(card);
  addHoverListener(card);

  // Check if the card is not the initial card before adding the remove button
  if (card.getAttribute("id") !== "initialCard") {
    var removeButton = document.createElement("button");
    removeButton.classList.add("remove-button", "hidden");
    removeButton.textContent = ""; // or any other text/icon you prefer
    removeButton.onclick = function () {
      removeCard(x, y);
    };
    card.appendChild(removeButton);
  }

  // Apply random style or other specific styles if needed
  applyRandomStyle(card);

  // Append the card to the container only if it's a new card
  if (isNewCard) {
    document.getElementById("cardContainer").appendChild(card);
  }
}
