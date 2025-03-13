/**
 * Loads and parses a CSV file
 * @param {string} url - The URL of the CSV file
 * @returns {Promise<string>} - The CSV data as text
 */
export async function loadCSV(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
} 