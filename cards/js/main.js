import { setupRandomizer, shuffle } from './randomizer.js';
import { parseUrlParams, setQueryStringParameter } from './urlUtils.js';
import { loadCardData } from './cardData.js';
import { saveCardState, loadCardState, createHistoryEntry, setupHistoryNavigation } from './stateManager.js';

// Main entry point for the application
function initializeApp() {
  // Load card data
  const cardData = loadCardData();
  
  // Load state (from URL or localStorage)
  const initialState = loadCardState();
  
  // Setup the shuffle button
  const shuffleButton = document.getElementById('shuffle');
  if (shuffleButton) {
    shuffleButton.addEventListener('click', () => {
      // Generate new random state by forcing random values
      const newState = shuffle(cardData, null, true);
      
      // Create a new history entry for this shuffle
      createHistoryEntry(newState);
    });
  }
  
  // Setup history navigation (for back/forward buttons)
  setupHistoryNavigation((state) => {
    if (state) {
      // When navigating history, update the display with the state from history
      shuffle(cardData, state, false);
    }
  });
  
  // Initial shuffle on page load (use saved state if available)
  shuffle(cardData, initialState, false);
}

// Start the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp); 