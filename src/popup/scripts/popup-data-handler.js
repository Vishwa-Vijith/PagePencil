// Handles fetching and managing notes.

const urlNoteMap = new Map();

/**
 * Fetches notes for the current tab.
 * @param {string} tabUrl - The URL of the current tab.
 * @returns {Promise<Array>} - Resolves with the fetched notes.
 */
export function fetchNotesForCurrentTab(tabUrl) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "getNotesFromDatabase", url: tabUrl },
      (response) => {
        if (response && response.status === "success") {
          response.highlights.forEach((note) => urlNoteMap.set(note.id, note));
          resolve(response.highlights);
        } else {
          console.error("Failed to fetch notes:", response?.message);
          reject(new Error("Failed to fetch notes"));
        }
      }
    );
  });
}

/**
 * Fetches favorite notes.
 * @returns {Promise<Array>} - Resolves with the fetched favorite notes.
 */
export function fetchFavouriteNotes() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "getAllFavouriteNotes" },
      (response) => {
        if (response && response.status === "success") {
          resolve(response.favourites);
        } else {
          console.error("Failed to fetch favourite notes:", response?.message);
          reject(new Error("Failed to fetch favourite notes"));
        }
      }
    );
  });
}

/**
 * Gets note data by ID.
 * @param {number} noteId - The note ID.
 * @returns {Object|null} - The note data or null if not found.
 */
export function getNoteById(noteId) {
  return urlNoteMap.get(Number(noteId)) || null;
}
