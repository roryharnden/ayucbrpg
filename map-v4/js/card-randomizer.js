// card-randomizer.js - Handles random card detail generation

// Card details lookup
let cardDetails = {
  14: {
    names: ["Name1", "Name2", "Name3"],
    descriptions: ["Description1", "Description2"],
    things: ["Thing1", "Thing2", "Thing3", "Thing4"],
  },
  // ... similar structure for other cards
};

// Helper function to get a random item from an array
export function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Initialize card data with empty details
export function initializeCardData(cardData) {
  cardData.forEach((card) => {
    card.details = {
      name: null,
      description: null,
      thing: null,
    };
  });
}

// Generate random details for a card
export function generateRandomDetails(cardId, cardData) {
  if (cardDetails[cardId]) {
    const card = cardData.find((c) => c.id == cardId);
    
    if (card && !card.details.name) {
      // Details not assigned yet
      const details = cardDetails[cardId];
      card.details.name = getRandomItem(details.names);
      card.details.description = getRandomItem(details.descriptions);
      card.details.thing = getRandomItem(details.things);
    }
    
    return card.details;
  }
  return null;
}

// Update sidebar with card details
export function updateSidebar(details) {
  if (details) {
    document.getElementById("sidebarName").textContent = details.name;
    document.getElementById("sidebarDescription").textContent = details.description;
    document.getElementById("sidebarThing").textContent = details.thing;
  }
}

// Add hover listener to card element
export function addCardHoverListener(cardElement, cardData) {
  cardElement.addEventListener("mouseover", function() {
    const cardId = this.getAttribute("data-card-id");
    const details = generateRandomDetails(cardId, cardData);
    if (details) {
      updateSidebar(details);
    }
  });
} 