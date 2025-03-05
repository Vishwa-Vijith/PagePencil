/*
MIT License
To search the notes with different parameter
*/

import { openDatabase, getTransaction } from "./database-handler.js";

let db = null;

/**
 * Searches notes in the database based on provided filters.
 * @param {Object} filters - The filters to apply (e.g., textNote, tag, url, isFavourite).
 * @param {Function} sendResponse - The callback function to send the response.
 */
export async function searchNotesByFilters(filters, sendResponse) {
  try {
    if (!db) db = await openDatabase();
    const objectStore = getTransaction("NotesStore", "readonly");
    const request = objectStore.openCursor();
    const matchingNotes = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const note = cursor.value;
        let isMatch = true;

        // Filter by textNote
        if (filters.textNote) {
          isMatch =
            isMatch &&
            note.textNote &&
            note.textNote
              .toLowerCase()
              .includes(filters.textNote.toLowerCase());
        }

        // Filter by tag
        if (
          filters.tag &&
          Array.isArray(filters.tag) &&
          filters.tag.length > 0
        ) {
          isMatch =
            isMatch &&
            note.tag &&
            Array.isArray(note.tag) &&
            note.tag.some((tag) =>
              filters.tag.some((filterTag) =>
                tag.name.toLowerCase().includes(filterTag.toLowerCase())
              )
            );
        }

        // Filter by URL
        if (filters.url) {
          isMatch =
            isMatch &&
            note.url &&
            note.url.toLowerCase().includes(filters.url.toLowerCase());
        }

        // Filter by isFavourite
        if (filters.isFavourite !== undefined) {
          isMatch = isMatch && note.isFavourite === filters.isFavourite;
        }

        // Add note to results if it matches all filters
        if (isMatch) {
          matchingNotes.push(note);
        }

        cursor.continue();
      } else {
        // No more notes to process, send the response
        sendResponse({ status: "success", matchingNotes });
      }
    };

    request.onerror = (event) => {
      console.error("Error searching notes by filters:", event.target.error);
      sendResponse({
        status: "error",
        message: "Error searching notes by filters.",
      });
    };
  } catch (error) {
    console.error("Unexpected error while searching notes:", error);
    sendResponse({ status: "error", message: "Unexpected error occurred." });
  }
}
