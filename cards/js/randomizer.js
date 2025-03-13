import { setQueryStringParameter } from './urlUtils.js';
import { saveCardState } from './stateManager.js';

/**
 * Sets up the randomizer functionality
 * @param {HTMLElement} button - The button that triggers randomization
 * @param {Function} callback - The function to call when the button is clicked
 */
export function setupRandomizer(button, callback) {
  if (button) {
    button.addEventListener('click', () => {
      // When button is clicked, force random values by passing forceRandom=true
      callback(true);
    });
  }
}

/**
 * Shuffles the card elements and updates the display
 * @param {Object} cardData - The card data for strengths, weaknesses, and items
 * @param {Object} params - URL parameters (a, b, c)
 * @param {boolean} forceRandom - Whether to force random values regardless of URL params
 * @returns {Object} - The new state (a, b, c values)
 */
export function shuffle(cardData, params = {}, forceRandom = false) {
  const imgCount = 18;
  const dir = "images/";
  const count = 18;
  const skewAmount = 5;
  
  // Apply random rotation to each card section
  const headElement = document.getElementById("head");
  const midElement = document.getElementById("mid");
  const footElement = document.getElementById("foot");
  
  // Apply random rotations
  headElement.style.transform = `rotate(${getRandomRotation(skewAmount)}deg)`;
  midElement.style.transform = `rotate(${getRandomRotation(skewAmount)}deg)`;
  footElement.style.transform = `rotate(${getRandomRotation(skewAmount)}deg)`;
  
  // Determine card indices (either from params or random)
  let headCount, midCount, footCount;
  
  // Only use provided parameters if not forcing random and params exist
  if (!forceRandom && params && params.a && params.b && params.c) {
    headCount = parseInt(params.a);
    midCount = parseInt(params.b);
    footCount = parseInt(params.c);
  } else {
    // Generate random values
    headCount = Math.round(Math.random() * (count - 1)) + 1;
    midCount = Math.round(Math.random() * (count - 1)) + count + 1;
    footCount = Math.round(Math.random() * (count - 1)) + count + count + 1;
  }
  
  console.log("headCount = " + headCount);
  console.log("midCount = " + midCount);
  console.log("footCount = " + footCount);
  
  // Set background images
  headElement.style.backgroundImage = `url(${dir}${headCount}.jpg)`;
  midElement.style.backgroundImage = `url(${dir}${midCount}.jpg)`;
  footElement.style.backgroundImage = `url(${dir}${footCount}.jpg)`;
  
  // Update URL parameters
  setQueryStringParameter("a", headCount);
  setQueryStringParameter("b", midCount);
  setQueryStringParameter("c", footCount);
  
  // Update text elements
  const strengthElement = document.getElementById('strength');
  const weaknessElement = document.getElementById('weakness');
  const itemElement = document.getElementById('item');
  
  if (strengthElement && cardData.strength[headCount]) {
    strengthElement.textContent = cardData.strength[headCount];
  }
  
  if (weaknessElement && cardData.weakness[midCount - 16]) {
    weaknessElement.textContent = cardData.weakness[midCount - 16];
  }
  
  if (itemElement && cardData.item[footCount - 32]) {
    itemElement.textContent = cardData.item[footCount - 32];
  }
  
  console.log("Shuffled");
  
  // Create the new state object
  const newState = { a: headCount, b: midCount, c: footCount };
  
  // Save state to localStorage and update URL (without creating history entry)
  saveCardState(newState);
  
  // Return the new state
  return newState;
}

/**
 * Generates a random rotation value
 * @param {number} skewAmount - The maximum skew amount
 * @returns {number} - A random rotation value
 */
function getRandomRotation(skewAmount) {
  return (Math.round(Math.random() * (skewAmount - 1)) - (0.5 * skewAmount));
}