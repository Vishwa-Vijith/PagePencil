/*
MIT License
Handles CRUD operations and favourites
*/

import { openDatabase, getTransaction } from "./database-handler.js";
import { notifyContentScript } from "./tabs.js";

let db = null;
const favouriteNoteIdsSet = new Set();
let favouriteNoteIdsArray = [];

/**
 * Saves a note to the database.
 * @param {Object} noteData - The note data.
 * @param {Function} sendResponse - The callback function.
 */
export async function saveNoteToDatabase(noteData, sendResponse) {
  try {
    if (!db) db = await openDatabase();
    const objectStore = getTransaction("PagePencil", "readwrite");

    const sanitizedNoteData = { ...noteData };
    if (sanitizedNoteData.id === null) {
      delete sanitizedNoteData.id;
    }

    const request = objectStore.add(sanitizedNoteData);

    request.onsuccess = () => {
      sendResponse({ success: true, message: "Note saved successfully!" });
      notifyContentScript();
    };

    request.onerror = (event) => {
      console.error("Error adding note:", event.target.error);
      sendResponse({
        success: false,
        message: "Failed to save note: " + event.target.error.message,
      });
    };
  } catch (error) {
    console.error("Unexpected error saving note:", error);
    sendResponse({ success: false, message: "Unexpected error occurred." });
  }
}

/**
 * Retrieves notes by URL.
 * @param {string} url - The URL to filter notes.
 * @param {Function} sendResponse - The callback function.
 */
export async function getNotesFromDatabaseByURL(url, sendResponse) {
  try {
    if (!db) db = await openDatabase();
    
    const objectStore = getTransaction("PagePencil", "readonly");
    const index = objectStore.index("url");
    const request = index.getAll(url);

    request.onsuccess = (event) => {
      sendResponse({ status: "success", highlights: event.target.result });
    };

    request.onerror = (event) => {
      console.error("Error retrieving highlights:", event.target.error);
      sendResponse({
        status: "error",
        message: "Error retrieving highlights.",
      });
    };
  } catch (error) {
    console.error("Unexpected error retrieving highlights:", error);
    sendResponse({ status: "error", message: "Unexpected error occurred." });
  }
}

/**
 * Updates a note by ID.
 * @param {Object} data - The note data to update.
 * @param {Function} sendResponse - The callback function.
 */
export async function updateNoteByIdInDatabase(data, sendResponse) {
  try {
    if (!db) db = await openDatabase();
    const objectStore = getTransaction("PagePencil", "readwrite");
    const request = objectStore.get(data.id);

    request.onsuccess = (event) => {
      const note = event.target.result;

      if (note) {
        note.textNote = data.textNote || note.textNote;
        note.tag = Array.isArray(data.tags)
          ? data.tags.map((tag) => tag.name)
          : note.tag;

        ///
        console.log("tags before update:", note.tags);
        console.log("tags after update:")
       

        console.log("tags ",note)
        ///
        if (data.isFavourite !== undefined) note.isFavourite = data.isFavourite;

        const updateRequest = objectStore.put(note);
        updateRequest.onsuccess = () => {
          sendResponse({
            success: true,
            message: "Note updated successfully.",
          });
          //notifyContentScript();
        };

        updateRequest.onerror = (event) => {
          console.error("Error updating the note:", event.target.error);
          sendResponse({
            success: false,
            message: "Failed to update the note.",
          });
        };
      } else {
        sendResponse({ success: false, message: "Note not found." });
      }
    };

    request.onerror = (event) => {
      console.error("Error retrieving the note:", event.target.error);
      sendResponse({ success: false, message: "Failed to retrieve the note." });
    };
  } catch (error) {
    console.error("Unexpected error updating note:", error);
    sendResponse({ success: false, message: "Unexpected error occurred." });
  }
}

/**
 * Deletes a note by ID.
 * @param {Object} data - The note ID.
 * @param {Function} sendResponse - The callback function.
 */
export async function deleteNoteByIdInDatabase(data, sendResponse) {
  try {
    if (!db) db = await openDatabase();
    const objectStore = getTransaction("PagePencil", "readwrite");
    const deleteRequest = objectStore.delete(data.id);

    deleteRequest.onsuccess = () => {
      sendResponse({ success: true, message: "Note deleted successfully." });
      notifyContentScript();
    };

    deleteRequest.onerror = (event) => {
      console.error("Error deleting the note:", event.target.error);
      sendResponse({ success: false, message: "Failed to delete the note." });
    };
  } catch (error) {
    console.error("Unexpected error while deleting note:", error);
    sendResponse({ success: false, message: "Unexpected error occurred." });
  }
}

/**
 * Adds a note ID to the favorites list.
 * @param {number} id - The note ID.
 */
export function addToFavouriteIdsTree(id) {
  favouriteNoteIdsSet.add(id);
  favouriteNoteIdsArray = Array.from(favouriteNoteIdsSet).sort((a, b) => a - b);
}

/**
 * Retrieves all favorite notes.
 * @param {Function} sendResponse - The callback function.
 */
export async function getAllFavouriteNotesFromDatabase(sendResponse) {
  try {
    const db = await openDatabase();
    const objectStore = getTransaction("PagePencil", "readonly");
    const request = objectStore.openCursor();
    const favouriteNotes = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.isFavourite) {
          favouriteNotes.push(cursor.value);
          addToFavouriteIdsTree(cursor.key);
        }
        cursor.continue();
      } else {
        sendResponse({ status: "success", favourites: favouriteNotes });
      }
    };

    request.onerror = (event) => {
      console.error("Error fetching favourite notes:", event.target.error);
      sendResponse({
        status: "error",
        message: "Error fetching favourite notes.",
      });
    };
  } catch (error) {
    console.error("Unexpected error fetching favourite notes:", error);
    sendResponse({ status: "error", message: "Unexpected error occurred." });
  }
}
