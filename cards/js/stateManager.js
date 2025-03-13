/**
 * Save the current card state
 * @param {Object} state - The card state (a, b, c values)
 */
export function saveCardState(state) {
  // Save to localStorage
  localStorage.setItem('cardState', JSON.stringify(state));
  
  // Update URL without creating history entry
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => params.set(key, value));
  const url = decodeURIComponent(`${location.pathname}?${params}`);
  window.history.replaceState(state, '', url);
}

/**
 * Create a new history entry with the current state
 * @param {Object} state - The card state (a, b, c values)
 */
export function createHistoryEntry(state) {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => params.set(key, value));
  const url = decodeURIComponent(`${location.pathname}?${params}`);
  window.history.pushState(state, '', url);
}

/**
 * Load card state from URL parameters or localStorage
 * @returns {Object} - The card state
 */
export function loadCardState() {
  // First try URL parameters (for shared links)
  const urlParams = {};
  const searchParams = new URLSearchParams(location.search);
  for (const [key, value] of searchParams.entries()) {
    urlParams[key] = value;
  }
  
  if (Object.keys(urlParams).length > 0) {
    return urlParams;
  }
  
  // Fall back to localStorage
  const savedState = localStorage.getItem('cardState');
  return savedState ? JSON.parse(savedState) : null;
}

/**
 * Generate a shareable URL for the current state
 * @returns {string} - Full URL for sharing
 */
export function getShareableUrl() {
  return window.location.href;
}

/**
 * Setup history navigation
 * @param {Function} callback - Function to call when navigating through history
 */
export function setupHistoryNavigation(callback) {
  window.addEventListener('popstate', (event) => {
    // When back/forward is pressed, use the state if available
    if (event.state) {
      callback(event.state);
    } else {
      // If no state in history entry, try to load from URL or localStorage
      callback(loadCardState());
    }
  });
} 