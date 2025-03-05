// Main popup script.

import { setupEventListeners } from "./popup-event-handler.js"; 
import { fetchNotesForCurrentTab } from "./popup-data-handler.js"; 
import { renderNotes } from "./popup-ui-handler.js"; 

// Initialize the popup
function initPopup() {
  // Fetch notes for the current tab on load
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const currentTab = tabs[0];
      fetchNotesForCurrentTab(currentTab.url)
        .then(renderNotes)
        .catch(() => renderNotes([]));
    } else {
      renderNotes([]);
    }
  });

  setupEventListeners();
}

initPopup();