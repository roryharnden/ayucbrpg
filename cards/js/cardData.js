/**
 * Loads card data for strengths, weaknesses, and items
 * @returns {Object} - Object containing card data
 */
export function loadCardData() {
  // Card data from the original script
  const data = [
    [1, "electricity", "a beard"],
    [2, "an eyepatch", "a tounge"],
    [3, "map", "sausage"],
    [4, "map", "sausage"],
    [5, "sock", "sausage"],
    [6, "map", "sausage"],
    [7, "a mask", "some lipstick"],
    [8, "map", "sausage"],
    [9, "map", "sausage"],
    [10, "map", "sausage"],
    [11, "map", "sausage"],
    [12, "map", "sausage"],
    [13, "bees!", "sweet things", "a net"],
    [14, "map", "sausage"],
    [15, "a spear", "an earring"],
    [16, "map", "sausage"]
  ];
  
  const strength = {};
  const weakness = {};
  const item = {};
  
  data.forEach(function(entry) {
    strength[entry[0]] = entry[1];
    weakness[entry[0]] = entry[2];
    item[entry[0]] = entry[3];
  });
  
  return { strength, weakness, item };
} 