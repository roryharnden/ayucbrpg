// card-details.js - Handles card details and sidebar updates
let cardData = [];
let cardDetails = {};
let currentHoveredCardId = null;

// Load card data from JSON
export async function loadCardData() {
  const response = await fetch("./cards.json");
  cardData = await response.json();
  return cardData;
}

// Get card data
export function getCardDataArray() {
  return cardData;
}

// Get current hovered card ID
export function getCurrentHoveredCardId() {
  return currentHoveredCardId;
}

// Set current hovered card ID
export function setCurrentHoveredCardId(cardId) {
  currentHoveredCardId = cardId;
}

// Get card details
export function getCardDetails() {
  return cardDetails;
}

// Update card details when a card is revealed
export function updateCardDetails(cardId) {
  const card = cardData.find(card => card.id === cardId);
  
  if (card && card.details) {
    // Check if the properties exist before trying to access their length
    const nameIndex = card.details.names && card.details.names.length > 0 
      ? getRandomIndex(card.details.names) 
      : 0;
      
    const descriptionIndex = card.details.descriptions && card.details.descriptions.length > 0 
      ? getRandomIndex(card.details.descriptions) 
      : 0;
      
    const thingsIndex = card.details.things && card.details.things.length > 0 
      ? getRandomIndex(card.details.things) 
      : 0;
    
    cardDetails[cardId] = {
      nameIndex: nameIndex,
      descriptionIndex: descriptionIndex,
      thingsIndex: thingsIndex,
      explored: false
    };
  } else {
    // Fallback for cards without details
    cardDetails[cardId] = {
      nameIndex: 0,
      descriptionIndex: 0,
      thingsIndex: 0,
      explored: false
    };
    
    // Create empty details if they don't exist
    if (card && !card.details) {
      card.details = {
        names: ["Unknown"],
        descriptions: ["No description available"],
        things: ["Nothing of interest"]
      };
    }
  }
}

// Update sidebar with card details
export function updateSidebar(cardId) {
  const cardDetail = cardDetails[cardId];
  
  if (cardDetail) {
    const card = cardData.find(card => card.id === parseInt(cardId));
    if (!card || !card.details) {
      console.error("Card or card details not found for ID:", cardId);
      return;
    }
    
    const cardDetailData = card.details;
    
    removeHoveredClassFromAllCards();
    
    const currentCardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
    if (currentCardElement) {
      currentCardElement.classList.add("current-card");
      applyRandomStyle(currentCardElement);
    }
    
    if (cardDetailData) {
      const cardName = document.getElementById("cardName");
      const cardDescription = document.getElementById("cardDescription");
      const cardThing = document.getElementById("cardThing");
      const cardThingWrap = document.getElementById("cardThingWrap");
      const exploreButton = document.getElementById("explore");
      
      // Safely access array elements with fallbacks
      cardName.textContent = cardDetailData.names && cardDetailData.names[cardDetail.nameIndex] 
        ? cardDetailData.names[cardDetail.nameIndex] 
        : "Unknown";
        
      cardDescription.innerHTML = cardDetailData.descriptions && cardDetailData.descriptions[cardDetail.descriptionIndex] 
        ? cardDetailData.descriptions[cardDetail.descriptionIndex] 
        : "No description available";
      
      if (cardDetail.explored) {
        cardThing.innerHTML = cardDetailData.things && cardDetailData.things[cardDetail.thingsIndex] 
          ? cardDetailData.things[cardDetail.thingsIndex] 
          : "Nothing of interest";
        cardThing.style.display = "block";
        exploreButton.textContent = "Explored";
        cardThingWrap.classList.add("explored");
      } else {
        cardThing.style.display = "none";
        exploreButton.textContent = "Explore";
        cardThingWrap.classList.remove("explored");
      }
    }
  }
}

// Remove hovered class from all cards
function removeHoveredClassFromAllCards() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => {
    card.classList.remove("current-card");
  });
}

// Get random index from array
function getRandomIndex(arr) {
  // Check if arr is defined and has a length property
  if (arr && Array.isArray(arr) && arr.length > 0) {
    return Math.floor(Math.random() * arr.length);
  }
  return 0; // Return 0 as a fallback
}

// Set up explore button
export function setupExploreButton() {
  document.getElementById("explore").addEventListener("click", function() {
    if (currentHoveredCardId && cardDetails[currentHoveredCardId]) {
      cardDetails[currentHoveredCardId].explored = true;
      updateSidebar(currentHoveredCardId);
    }
  });
}

// Import necessary functions
import { applyRandomStyle } from './utils.js';
