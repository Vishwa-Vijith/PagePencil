// Handles event listeners and UI interactions.

import {
  fetchNotesForCurrentTab,
  fetchFavouriteNotes,
  getNoteById
} from "./popup-data-handler.js";
import { renderNotes, setupNoteClickHandler } from "./popup-ui-handler.js";

const pagesNoteTab = document.getElementById("pages-note-tab");
const favouriteNoteTab = document.getElementById("favourite-note-tab");

/**
 * Sets up event listeners for the popup.
 */
export function setupEventListeners() {
  // Handle clicks on the "Pages" tab
  pagesNoteTab.addEventListener("click", () => {
    pagesNoteTab.classList.add("active");
    favouriteNoteTab.classList.remove("active");

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
  });

  // Handle clicks on the "Favourites" tab
  favouriteNoteTab.addEventListener("click", () => {
    favouriteNoteTab.classList.add("active");
    pagesNoteTab.classList.remove("active");
    fetchFavouriteNotes()
      .then(renderNotes)
      .catch(() => renderNotes([]));
  });

  // Handle note item clicks
  setupNoteClickHandler((noteId) => {
    const noteData = getNoteById(noteId);
    if (noteData) {
      const noteDataString = encodeURIComponent(JSON.stringify(noteData));
      window.location.href = `../shared-scripts/html/display-note.html?noteData=${noteDataString}`;
    }
  });

  // Handle database updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "databaseUpdated") {
      if (pagesNoteTab.classList.contains("active")) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            const currentTab = tabs[0];
            fetchNotesForCurrentTab(currentTab.url)
              .then(renderNotes)
              .catch(() => renderNotes([]));
          }
        });
      } else if (favouriteNoteTab.classList.contains("active")) {
        fetchFavouriteNotes()
          .then(renderNotes)
          .catch(() => renderNotes([]));
      }
    }
  });
}
