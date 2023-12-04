
let cardDetails = {
    14: {
      names: ["Name1", "Name2", "Name3"],
      descriptions: ["Description1", "Description2"],
      things: ["Thing1", "Thing2", "Thing3", "Thing4"],
    },
    // ... similar structure for other cards
  };

cardData.forEach((card) => {
  card.details = {
    name: null,
    description: null,
    thing: null,
  };
});

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}



if (cardDetails[cardId]) {
  function onCardHover() {
    let cardId = this.getAttribute("data-card-id");
    let card = cardData.find((c) => c.id == cardId);

    if (!card.details.name) {
      // Details not assigned yet
      let details = cardDetails[cardId];
      card.details.name = getRandomItem(details.names);
      card.details.description = getRandomItem(details.descriptions);
      card.details.thing = getRandomItem(details.things);
    }

    // Display the details in the sidebar or as a tooltip
    // Example: updateSidebar(card.details);
  }
} else {
  // Handle the scenario where a card doesn't have additional details
  // Maybe display a default message or hide the sidebar elements
}

// Add this hover listener to your card elements

function updateSidebar(details) {
  // Assuming you have elements in your HTML to display these details
  document.getElementById("sidebarName").textContent = details.name;
  document.getElementById("sidebarDescription").textContent =
    details.description;
  document.getElementById("sidebarThing").textContent = details.thing;
}


// Example of attaching the event listener
cardElement.addEventListener("mouseover", onCardHover);
