// main.js - Entry point for the application
import { initializeCardManager, centerCardContainer } from './card-manager.js';
import { setupUIControls } from './ui-controls.js';
import { reconstructMapFromState } from './state-manager.js';
import { loadCardData } from './card-details.js';
import { initializeCardData } from './card-randomizer.js';

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  // Center the card container only once at startup
  centerCardContainer();
  
  await loadCardData();
  
  // Check for shared state in URL
  const urlParams = new URLSearchParams(window.location.search);
  const compressedState = urlParams.get("state");
  
  if (compressedState) {
    reconstructMapFromState(compressedState);
  } else {
    // Initialize with first card if no state
    initializeCardManager();
  }
  
  // Setup UI controls
  setupUIControls();
});
