// ui-controls.js - UI controls like zoom and share
import { createShareableLink } from './state-manager.js';
import { setupExploreButton } from './card-details.js';

// Set up UI controls
export function setupUIControls() {
  setupPanzoom();
  setupShareButton();
  setupExploreButton();
}

// Set up Panzoom for zooming and panning
function setupPanzoom() {
  const elem = document.getElementById("cardContainer");
  const panzoom = Panzoom(elem, {
    maxScale: 2,
    minScale: 0.5,
    step: 0.2,
    canvas: true,
    animate: true,
    exclude: ['.panzoom-exclude'], // Make sure unknown cards have this class
    handleStartEvent: (e) => {
      // Prevent panzoom from handling events on unknown cards
      if (e.target.classList.contains('unknown-card')) {
        e.stopPropagation();
        return false;
      }
      return true;
    }
  });
  
  // Set up zoom buttons
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");
  
  zoomInButton.addEventListener("click", panzoom.zoomIn);
  zoomOutButton.addEventListener("click", panzoom.zoomOut);
  
  // Enable mouse wheel zooming
  elem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);
  
  return panzoom;
}

// Set up share button
function setupShareButton() {
  document.getElementById("shareButton").addEventListener("click", function() {
    const shareableLink = createShareableLink();
    
    // Try using Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy the link: ", err);
          fallbackCopyTextToClipboard(shareableLink);
        });
    } else {
      fallbackCopyTextToClipboard(shareableLink);
    }
  });
}

// Fallback method for copying text to clipboard
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand("copy");
    alert("Link copied to clipboard!");
  } catch (err) {
    console.error("Fallback: Unable to copy", err);
  }
  
  document.body.removeChild(textArea);
}
