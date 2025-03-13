/**
 * Parses URL parameters
 * @returns {Object} - Object containing URL parameters
 */
export function parseUrlParams() {
  const params = {};
  const searchParams = new URLSearchParams(location.search);
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Sets a URL parameter
 * @param {string} name - Parameter name
 * @param {string} value - Parameter value
 */
export function setQueryStringParameter(name, value) {
  const params = new URLSearchParams(location.search);
  params.set(name, value);
  window.history.replaceState({}, "", decodeURIComponent(`${location.pathname}?${params}`));
} 