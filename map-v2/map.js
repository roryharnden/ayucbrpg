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
document.addEventListener("DOMContentLoaded", (event) => {
  initializeGrid();
});

let grid = []; // Represents the state of the map
const gridDimension = 3; // Initial grid dimension, e.g., 3x3

function createGridItem(id, isCard, x, y) {
  const item = document.createElement("div");
  item.className = "grid-item";
  if (isCard) {
    item.classList.add("card");
    item.textContent = `Card ${id}`;
  } else {
    item.textContent = "Empty Space";
    item.addEventListener("click", () => onSpaceClick(y, x));
  }
  return item;
}

function initializeGrid() {
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = ""; // Clear existing content

  grid = []; // Reset the grid

  // Randomly select the first card
  const firstCardId = cardData[Math.floor(Math.random() * cardData.length)].id;

  // Create a grid with the center grid having the initial random card
  for (let i = 0; i < gridDimension; i++) {
    for (let j = 0; j < gridDimension; j++) {
      let isCard = i === 1 && j === 1;
      let cardId = isCard ? firstCardId : null;
      let gridItem = createGridItem(cardId, isCard, i, j);
      mapContainer.appendChild(gridItem);

      // Add the grid item object to the grid array
      grid.push({
        x: j,
        y: i,
        card: gridItem, // This is the actual DOM element
        cardId: cardId, // The ID of the card in this position
      });
    }
  }
}

function onSpaceClick(x, y) {
  let requiredEdges = determineRequiredEdges(x, y);
  let newCard = selectValidCard(requiredEdges);
  placeCard(newCard, x, y);
  updateAvailableSpaces();
  renderMap();
}

function determineRequiredEdges(x, y) {
  let requiredEdges = { top: null, right: null, bottom: null, left: null };

  // Calculate index in the flat array
  let index = y * gridDimension + x;

  // Check top cell
  if (y > 0) {
    let topIndex = index - gridDimension;
    if (grid[topIndex] && grid[topIndex].cardId) {
      const topCard = cardData.find(
        (card) => card.id === grid[topIndex].cardId
      );
      requiredEdges.top = topCard.bottom === "water" ? "water" : "land";
    }
  }

  // Check right cell
  if (x < gridDimension - 1) {
    let rightIndex = index + 1;
    if (grid[rightIndex] && grid[rightIndex].cardId) {
      const rightCard = cardData.find(
        (card) => card.id === grid[rightIndex].cardId
      );
      requiredEdges.right = rightCard.left === "water" ? "water" : "land";
    }
  }

  // Check bottom cell
  if (y < gridDimension - 1) {
    let bottomIndex = index + gridDimension;
    if (grid[bottomIndex] && grid[bottomIndex].cardId) {
      const bottomCard = cardData.find(
        (card) => card.id === grid[bottomIndex].cardId
      );
      requiredEdges.bottom = bottomCard.top === "water" ? "water" : "land";
    }
  }

  // Check left cell
  if (x > 0) {
    let leftIndex = index - 1;
    if (grid[leftIndex] && grid[leftIndex].cardId) {
      const leftCard = cardData.find(
        (card) => card.id === grid[leftIndex].cardId
      );
      requiredEdges.left = leftCard.right === "water" ? "water" : "land";
    }
  }

  console.log("Required Edges for position", x, y, ":", requiredEdges);
  return requiredEdges;
}

function selectValidCard(requiredEdges) {
  // Filter out cards that have already been used
  const availableCards = cardData.filter(
    (card) => !grid.some((g) => g.cardId === card.id)
  );
  console.log("Available Cards:", availableCards);

  // Find a card that matches the required edges
  const matchingCards = availableCards.filter((card) => {
    return (
      (!requiredEdges.top || card.top === requiredEdges.top) &&
      (!requiredEdges.right || card.right === requiredEdges.right) &&
      (!requiredEdges.bottom || card.bottom === requiredEdges.bottom) &&
      (!requiredEdges.left || card.left === requiredEdges.left)
    );
  });

  // Select a random card from the matching cards
  if (matchingCards.length > 0) {
    const selectedCard =
      matchingCards[Math.floor(Math.random() * matchingCards.length)];
    return selectedCard;
  }

  return null; // No matching card found
}

function placeCard(card, x, y) {
  if (card) {
    const gridItem = grid.find((item) => item.x === x && item.y === y);
    if (gridItem) {
      gridItem.cardId = card.id; // Update the grid item with the new card ID
      // Set the background image
      gridItem.card.style.backgroundImage = `url('../map-v2/images/map_${card.id}.jpg')`;
      gridItem.card.classList.add("card"); // Add the card class
    }
    console.log("Placing card at position", x, y, ":", card);
  }
}

function updateAvailableSpaces() {
  // Loop through each grid item
  grid.forEach((item) => {
    // Check if a card is placed in the current grid item
    if (item.cardId) {
      // Disable click on this grid item as it already has a card
      item.card.removeEventListener("click", onSpaceClick);
    } else {
      // Enable click on adjacent empty spaces to the placed cards
      // Check adjacent cells and enable click if adjacent to a placed card
      // Add logic based on your grid structure and placement rules
    }
  });
}

function renderMap() {
  grid.forEach((item) => {
    if (item && item.card) {
      if (item.cardId) {
        // Update the item's appearance to show the card's details
        item.card.textContent = ""; // Clear text content
        item.card.style.backgroundImage = `url('../map-v2/images/map_${item.cardId}.jpg')`;
        item.card.classList.add("card");
      } else {
        // Update the item's appearance to show it as an empty space
        item.card.textContent = "Empty Space";
        item.card.style.backgroundImage = ""; // Remove background image
        item.card.classList.remove("card");
      }
    } else {
      console.error("Undefined grid item or card element", item);
    }
  });
}

function onSpaceClick(x, y) {
  let requiredEdges = determineRequiredEdges(x, y);
  let newCard = selectValidCard(requiredEdges);
  placeCard(newCard, x, y);
  updateAvailableSpaces();
  renderMap();
}

initializeGrid();
