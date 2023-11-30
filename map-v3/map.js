// Get the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const cardWidth = 200; // width of a card in pixels
const cardHeight = 400; // height of a card in pixels
const cardSpacing = 8; // space between cards in pixels

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
    console.log("Simple click detected on card");
    changeCardBackground.call(this);
  });
}

function changeCardBackground() {
  var randomCard = cardData[Math.floor(Math.random() * cardData.length)];
  var imageUrl = "../map-v3/images/map_" + randomCard.id + ".jpg";
  this.style.backgroundImage = 'url("' + imageUrl + '")';

  var position = this.getAttribute("data-position").split(",").map(Number);
  var x = position[0];
  var y = position[1];

  // Check and place new cards in adjacent positions
  placeNewCardIfEmpty(x, y - 1); // Top
  placeNewCardIfEmpty(x + 1, y); // Right
  placeNewCardIfEmpty(x, y + 1); // Bottom
  placeNewCardIfEmpty(x - 1, y); // Left
}

function placeNewCardIfEmpty(x, y) {
  var existingCard = document.querySelector(`[data-position="${x},${y}"]`);
  if (!existingCard) {
    createNewCard(x, y);
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
