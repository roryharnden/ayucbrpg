// card-manager.js - Handles card creation, placement and interaction
import { 
  findMatchingCard, 
  getCardData, 
  usedCardIds, 
  isAdjacentToKnownCard, 
  cardWidth, 
  cardHeight, 
  cardSpacing, 
  applyRandomStyle 
} from './utils.js';

import { 
  updateCardDetails, 
  updateSidebar, 
  setCurrentHoveredCardId, 
  getCurrentHoveredCardId,
  getCardDetails 
} from './card-details.js';

// Initialize the first card
export function initializeCardManager() {
  const mapCard = document.querySelector(".card");
  if (mapCard) {
    mapCard.setAttribute("data-position", "0,0");
    addClickDetection(mapCard);
    addHoverListener(mapCard);
    changeCardBackground.call(mapCard);
  }
}

// Center the card container in the viewport and update all card positions
export function centerCardContainer() {
  const cardWrap = document.querySelector(".card-wrap");
  const initialCard = document.getElementById("initialCard");
  
  // Store the old position to calculate the offset
  const oldLeft = parseInt(initialCard.style.left, 10) || 0;
  const oldTop = parseInt(initialCard.style.top, 10) || 0;

  // Calculate the new center position
  const centerX = cardWrap.offsetWidth / 2 - cardWidth / 2;
  const centerY = cardWrap.offsetHeight / 2 - cardHeight / 2;
  
  // Calculate the offset (how much the initial card moved)
  const offsetX = centerX - oldLeft;
  const offsetY = centerY - oldTop;
  
  // Update the initial card position
  initialCard.style.left = centerX + "px";
  initialCard.style.top = centerY + "px";
  
  // Only update other cards if the initial card actually moved
  if (offsetX !== 0 || offsetY !== 0) {
    // Update all other cards to maintain their relative positions
    const allCards = document.querySelectorAll(".card:not(#initialCard)");
    allCards.forEach(card => {
      const currentLeft = parseInt(card.style.left, 10);
      const currentTop = parseInt(card.style.top, 10);
      
      card.style.left = (currentLeft + offsetX) + "px";
      card.style.top = (currentTop + offsetY) + "px";
    });
  }
  
  // Add debug logs to check values
  console.log("Card wrap width:", cardWrap.offsetWidth);
  console.log("Card wrap height:", cardWrap.offsetHeight);
  console.log("Center X:", centerX);
  console.log("Center Y:", centerY);
  console.log("Offset X:", offsetX);
  console.log("Offset Y:", offsetY);
}

// Add click detection to a card
export function addClickDetection(cardElement) {
  // Track if we're dragging and the starting position
  let isDragging = false;
  let startX, startY;
  
  // On mouse down, record the starting position
  cardElement.addEventListener("mousedown", function(e) {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;
  });
  
  // On mouse move, check if we're dragging
  cardElement.addEventListener("mousemove", function(e) {
    if (e.buttons === 1) { // Left mouse button is pressed
      // Calculate distance moved
      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);
      
      // If moved more than a small threshold, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        isDragging = true;
      }
    }
  });
  
  // On click, only reveal the card if we weren't dragging
  cardElement.addEventListener("click", function(e) {
    // Check if the card is already revealed or if we were dragging
    if (!this.classList.contains("unknown-card") || isDragging) {
      return;
    }
    changeCardBackground.call(this);
  });
  
  // Reset dragging state on mouse up
  cardElement.addEventListener("mouseup", function() {
    // We don't reset isDragging here because the click event fires after mouseup
    // isDragging will be reset on the next mousedown
  });
  
  // Also handle touch events for mobile
  let touchStartX, touchStartY;
  
  cardElement.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = false;
  });
  
  cardElement.addEventListener("touchmove", function(e) {
    // Calculate distance moved
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
    
    // If moved more than a small threshold, consider it a drag
    if (deltaX > 10 || deltaY > 10) {
      isDragging = true;
    }
  });
  
  cardElement.addEventListener("touchend", function(e) {
    if (!this.classList.contains("unknown-card") || isDragging) {
      return;
    }
    changeCardBackground.call(this);
  });
}

// Change card background when clicked
function changeCardBackground() {
  const position = this.getAttribute("data-position").split(",").map(Number);
  const [x, y] = position;

  // Find a matching card based on adjacent cards
  const matchingCard = findMatchingCard(x, y);
  if (matchingCard) {
    const imageUrl = "./images/map_" + matchingCard.id + ".jpg";
    this.style.backgroundImage = 'url("' + imageUrl + '")';
    this.classList.remove("unknown-card", "panzoom-exclude");
    this.setAttribute("data-card-id", matchingCard.id);

    // Check and place new cards in adjacent positions
    placeNewCardIfEmpty(x, y - 1);
    placeNewCardIfEmpty(x + 1, y);
    placeNewCardIfEmpty(x, y + 1);
    placeNewCardIfEmpty(x - 1, y);
    usedCardIds.push(matchingCard.id);

    // Create a remove button for non-initial cards
    if (this.getAttribute("id") !== "initialCard") {
      addRemoveButton(this, x, y);
    }

    applyRandomStyle(this);
    
    // Generate card details
    const cardId = parseInt(this.getAttribute("data-card-id"));
    updateCardDetails(cardId);
    
    // Remove invalid 'unknown' cards
    removeInvalidUnknownCards();
    
    // Update sidebar
    setCurrentHoveredCardId(cardId);
    updateSidebar(cardId);
  }

  addHoverListener(this);
}

// Add hover listener to show details in the sidebar
export function addHoverListener(cardElement) {
  let hoverTimeout;

  cardElement.addEventListener("mouseover", function() {
    clearTimeout(hoverTimeout);
    
    hoverTimeout = setTimeout(() => {
      if (!this.classList.contains("unknown-card")) {
        const cardId = parseInt(this.getAttribute("data-card-id"));
        
        // Only update if hovering over a different card
        if (cardId !== getCurrentHoveredCardId()) {
          setCurrentHoveredCardId(cardId);
          updateSidebar(cardId);
        }
      }
    }, 250);
  });

  cardElement.addEventListener("mouseout", function() {
    clearTimeout(hoverTimeout);
  });
}

// Add remove button to a card
function addRemoveButton(cardElement, x, y) {
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button", "hidden");
  removeButton.textContent = "";
  removeButton.onclick = function() {
    removeCard(x, y);
  };
  cardElement.appendChild(removeButton);
}

// Place a new card if the position is empty
function placeNewCardIfEmpty(x, y) {
  const existingCard = document.querySelector(`[data-position="${x},${y}"]`);
  if (!existingCard && findMatchingCard(x, y) !== null) {
    createNewCard(x, y);
  }
}

// Create a new unknown card
function createNewCard(x, y) {
  const newCard = document.createElement("div");
  newCard.classList.add("card", "unknown-card");
  newCard.style.position = "absolute";
  newCard.style.left = calculateLeftPosition(x) + "px";
  newCard.style.top = calculateTopPosition(y) + "px";
  newCard.style.width = cardWidth + "px";
  newCard.style.height = cardHeight + "px";
  newCard.setAttribute("data-position", `${x},${y}`);

  addClickDetection(newCard);
  document.getElementById("cardContainer").appendChild(newCard);
}

// Calculate left position based on x coordinate
export function calculateLeftPosition(x) {
  const initialCard = document.getElementById("initialCard");
  const initialLeft = parseInt(initialCard.style.left, 10);
  return initialLeft + x * (cardWidth + cardSpacing);
}

// Calculate top position based on y coordinate
export function calculateTopPosition(y) {
  const initialCard = document.getElementById("initialCard");
  const initialTop = parseInt(initialCard.style.top, 10);
  return initialTop + y * (cardHeight + cardSpacing);
}

// Export the reevaluateForUnknownCards function
export function reevaluateForUnknownCards() {
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

// Export the removeInvalidUnknownCards function
export function removeInvalidUnknownCards() {
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

// Export the removeCard function
export function removeCard(x, y) {
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
    const cardDetails = getCardDetails();
    delete cardDetails[cardId];

    // Create a new 'unknown' card in the removed card's position
    createNewUnknownCard(x, y);

    // Re-evaluate unknown cards after removal
    reevaluateForUnknownCards();
    removeInvalidUnknownCards();
  }
}

// Helper function for reevaluateForUnknownCards
function placeUnknownCardIfEmpty(x, y) {
  if (!document.querySelector(`[data-position="${x},${y}"]`)) {
    createNewUnknownCard(x, y);
  }
}

// Create a new unknown card
function createNewUnknownCard(x, y) {
  if (!document.querySelector(`[data-position="${x},${y}"]`)) {
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
}

// More functions would be here...
