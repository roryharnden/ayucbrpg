// utils.js - Helper functions and constants
export const cardWidth = 300;
export const cardHeight = 600;
export const cardSpacing = -2;
export let usedCardIds = [];

// Apply random style to a card
export function applyRandomStyle(cardElement) {
  const rotation = (Math.random() - 0.5) * 2;
  const shiftX = (Math.random() - 0.5) * 4;
  cardElement.style.transform = `rotate(${rotation}deg) translateX(${shiftX}px)`;
}

// Find a matching card based on adjacent cards
export function findMatchingCard(x, y) {
  const topCard = getCardData(x, y - 1);
  const rightCard = getCardData(x + 1, y);
  const bottomCard = getCardData(x, y + 1);
  const leftCard = getCardData(x - 1, y);
  
  let matchingCards = [];
  
  for (let card of getCardDataArray()) {
    if (
      !usedCardIds.includes(card.id) &&
      (topCard === null || card.top === topCard.bottom) &&
      (rightCard === null || card.right === rightCard.left) &&
      (bottomCard === null || card.bottom === bottomCard.top) &&
      (leftCard === null || card.left === leftCard.right)
    ) {
      matchingCards.push(card);
    }
  }
  
  if (matchingCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchingCards.length);
    return matchingCards[randomIndex];
  }
  
  // Check if the position has been removed
  const removedPosition = document.querySelector(`[data-position="${x},${y}"]`);
  if (!removedPosition) {
    return null;
  }
  
  return null;
}

// Get the data of a card at a given position
export function getCardData(x, y) {
  const cardElem = document.querySelector(`[data-position="${x},${y}"]`);
  if (cardElem && !cardElem.classList.contains("unknown-card")) {
    const cardId = parseInt(cardElem.getAttribute("data-card-id"));
    return getCardDataArray().find(card => card.id === cardId);
  }
  return null;
}

// Check if a position is adjacent to a known card
export function isAdjacentToKnownCard(x, y) {
  return (
    getCardData(x, y - 1) || // Top
    getCardData(x + 1, y) || // Right
    getCardData(x, y + 1) || // Bottom
    getCardData(x - 1, y)    // Left
  );
}

// Import functions from card-details.js
import { getCardDataArray } from './card-details.js';
