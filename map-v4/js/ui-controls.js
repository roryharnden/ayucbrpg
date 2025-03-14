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
    minScale: 0.2,
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
  
  // Store panzoom instance globally for access from other modules
  window.panzoomInstance = panzoom;
  
  return panzoom;
}

// Fine-tuned function to fit all cards in viewport
export function fitAllCardsInView() {
  if (!window.panzoomInstance) {
    console.error("Panzoom instance not found");
    return;
  }
  
  const container = document.getElementById("cardContainer");
  const cards = document.querySelectorAll(".card:not(.unknown-card)");
  
  if (cards.length === 0) {
    console.warn("No cards found to fit in view");
    return;
  }
  
  // Find the bounding box of all cards in their original positions
  let minLeft = Infinity, minTop = Infinity;
  let maxRight = -Infinity, maxBottom = -Infinity;
  
  cards.forEach(card => {
    const left = parseInt(card.style.left, 10) || 0;
    const top = parseInt(card.style.top, 10) || 0;
    const width = parseInt(card.style.width, 10) || card.offsetWidth;
    const height = parseInt(card.style.height, 10) || card.offsetHeight;
    
    minLeft = Math.min(minLeft, left);
    minTop = Math.min(minTop, top);
    maxRight = Math.max(maxRight, left + width);
    maxBottom = Math.max(maxBottom, top + height);
  });
  
  // Add more padding
  const padding = 100;
  minLeft -= padding;
  minTop -= padding;
  maxRight += padding;
  maxBottom += padding;
  
  // Calculate dimensions of the content
  const contentWidth = maxRight - minLeft;
  const contentHeight = maxBottom - minTop;
  
  // Get viewport dimensions
  const viewportWidth = container.parentElement.offsetWidth;
  const viewportHeight = container.parentElement.offsetHeight;
  
  // Calculate scale to fit
  const scaleX = viewportWidth / contentWidth;
  const scaleY = viewportHeight / contentHeight;
  let scale = Math.min(scaleX, scaleY);
  
  // Reduce the scale by 15% to zoom out a bit more
  scale = scale * 0.85;
  
  // Ensure scale is within bounds (using new minScale of 0.2)
  scale = Math.max(scale, 0.2);  // Don't zoom out beyond new minScale
  scale = Math.min(scale, 1);    // Don't zoom in beyond 1x
  
  // Calculate the center of the content
  const contentCenterX = minLeft + (contentWidth / 2);
  const contentCenterY = minTop + (contentHeight / 2);
  
  console.log("Auto-zoom calculation:", {
    cards: cards.length,
    bounds: { minLeft, minTop, maxRight, maxBottom },
    content: { width: contentWidth, height: contentHeight, centerX: contentCenterX, centerY: contentCenterY },
    viewport: { width: viewportWidth, height: viewportHeight },
    scale
  });
  
  // First reset the panzoom instance
  window.panzoomInstance.reset();
  
  // Then apply our calculated values after a short delay
  setTimeout(() => {
    // Set the zoom level
    window.panzoomInstance.zoom(scale);
    
    // Calculate the pan values to center the content in the viewport
    const panX = (viewportWidth / 2) - (contentCenterX * scale);
    const panY = (viewportHeight / 2) - (contentCenterY * scale);
    
    // Apply the pan
    window.panzoomInstance.pan(panX, panY);
    
    console.log("Applied zoom and pan:", { scale, panX, panY });
  }, 100);
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
