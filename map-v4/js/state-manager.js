// state-manager.js - Handles state encoding/decoding for sharing
import { usedCardIds } from './utils.js';
import { getCardDetails } from './card-details.js';
import { calculateLeftPosition, calculateTopPosition, addClickDetection, addHoverListener, reevaluateForUnknownCards, removeInvalidUnknownCards, removeCard } from './card-manager.js';
import { applyRandomStyle, cardWidth, cardHeight } from './utils.js';

// Encode the current state of the map
export function encodeCardState() {
  let encodedState = [];
  
  document.querySelectorAll(".card:not(.unknown-card)").forEach(card => {
    const position = card.getAttribute("data-position");
    const cardId = card.getAttribute("data-card-id");
    const cardDetail = getCardDetails()[cardId];
    
    if (position && cardId && cardDetail) {
      encodedState.push(
        `${position},${cardId},${cardDetail.nameIndex}${cardDetail.descriptionIndex}${cardDetail.thingsIndex},${cardDetail.explored ? "1" : "0"}`
      );
    }
  });
  
  return encodedState.join("|");
}

// Create a shareable link with the encoded state
export function createShareableLink() {
  const encodedState = encodeCardState();
  const baseUrl = window.location.href.split("?")[0];
  return baseUrl + "?state=" + encodedState;
}

// Reconstruct the map from a compressed state
export function reconstructMapFromState(compressedState) {
  const cardDetails = getCardDetails();
  Object.keys(cardDetails).forEach(key => delete cardDetails[key]);
  usedCardIds.length = 0;
  
  const cardStates = compressedState.split("|");
  
  cardStates.forEach(state => {
    const [positionX, positionY, cardId, detailString, exploredString] = state.split(",");
    
    const nameIndex = parseInt(detailString.charAt(0));
    const descriptionIndex = parseInt(detailString.charAt(1));
    const thingsIndex = parseInt(detailString.charAt(2));
    const explored = exploredString === "1";
    
    cardDetails[cardId] = {
      nameIndex: nameIndex,
      descriptionIndex: descriptionIndex,
      thingsIndex: thingsIndex,
      explored: explored
    };
    
    placeCardAt(positionX, positionY, cardId, [nameIndex, descriptionIndex, thingsIndex]);
    usedCardIds.push(parseInt(cardId));
  });
  
  const initialCardId = document.getElementById("initialCard").getAttribute("data-card-id");
  if (initialCardId) {
    setCurrentHoveredCardId(parseInt(initialCardId));
    updateSidebar(parseInt(initialCardId));
  }
  
  reevaluateForUnknownCards();
  removeInvalidUnknownCards();
}

// Place a card at a specific position
function placeCardAt(x, y, cardId, detailIndices) {
  let cardSelector = `[data-position="${x},${y}"]`;
  let card = document.querySelector(cardSelector);
  
  let isNewCard = false;
  if (!card) {
    card = document.createElement("div");
    isNewCard = true;
  }
  
  card.classList.add("card");
  card.classList.remove("unknown-card", "panzoom-exclude");
  card.style.position = "absolute";
  card.style.left = calculateLeftPosition(x) + "px";
  card.style.top = calculateTopPosition(y) + "px";
  card.style.width = cardWidth + "px";
  card.style.height = cardHeight + "px";
  card.setAttribute("data-position", `${x},${y}`);
  card.setAttribute("data-card-id", cardId);
  
  const imageUrl = `./images/map_${cardId}.jpg`;
  card.style.backgroundImage = `url("${imageUrl}")`;
  
  addClickDetection(card);
  addHoverListener(card);
  
  if (card.getAttribute("id") !== "initialCard") {
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button", "hidden");
    removeButton.textContent = "";
    removeButton.onclick = function() {
      removeCard(x, y);
    };
    card.appendChild(removeButton);
  }
  
  applyRandomStyle(card);
  
  if (isNewCard) {
    document.getElementById("cardContainer").appendChild(card);
  }
}

// Import necessary functions
import { setCurrentHoveredCardId, updateSidebar } from './card-details.js';
