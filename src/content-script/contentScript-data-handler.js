/*
MIT License
Handles the CRUD operations 
*/

import { highlightTextInContrastColour } from "./highlight.js";

/**
 * Fetches notes from the database for the current URL.
 * @returns {Promise<string>} - Resolves with a success message.
 */
export async function getNotesFromDatabase() {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        { action: "getNotesFromDatabase", url: window.location.href },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error in message passing:",
              chrome.runtime.lastError
            );
            reject(new Error("Extension context invalidated"));
            return;
          }

          if (
            response &&
            response.status === "success" &&
            response.highlights
          ) {
            response.highlights.forEach((highlight) => {
              highlightTextInContrastColour(highlight);
            });
            resolve("UI updated with highlights");
          } else {
            resolve("No highlights to update");
          }
        }
      );
    } catch (error) {
      console.error("Error during message passing:", error);
      reject(error);
    }
  });
}

/**
 * Saves a note to the database.
 * @param {string} noteContent - The content of the note.
 * @param {string} tag - The tag for the note.
 * @param {Object} metadata - Metadata for the note.
 */
export function saveNoteToDatabase(noteContent, tag, metadata) {
  const {
    startContainerXPath,
    startOffset,
    endContainerXPath,
    endOffset,
    selectedText,
  } = metadata;
  const url = window.location.href;

  chrome.runtime.sendMessage(
    {
      action: "saveNoteToDatabase",
      url,
      startContainerXPath,
      startOffset,
      endContainerXPath,
      endOffset,
      selectedText,
      tag: tag || "",
      textNote: noteContent,
      visualNote: "",
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save note:", chrome.runtime.lastError.message);
        return;
      }

      if (response && response.status === "success") {
        console.log("Note saved successfully");
      } else {
        console.error("Failed to save note:", response);
      }
    }
  );
}

/**
 * Deletes a note from the database.
 * @param {Object} highlight - The note to delete.
 */
export function deleteNoteInDatabase(highlight) {
  const { id } = highlight;

  chrome.runtime.sendMessage(
    { action: "deleteNoteInDatabase", id },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to delete note:",
          chrome.runtime.lastError.message
        );
        return;
      }

      if (response && response.status === "success") {
        console.log("Note deleted successfully");
      } else {
        console.error("Failed to delete note:", response);
      }
    }
  );
}

/**
 * Updates a note in the database.
 * @param {string} textNote - The updated note content.
 * @param {Object} highlight - The note to update.
 */
export function updateNoteToDatabase(textNote, highlight) {
  const { id } = highlight;

  chrome.runtime.sendMessage(
    { action: "updateNoteToDatabase", id, textNote },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to update note:",
          chrome.runtime.lastError.message
        );
        return;
      }

      if (response && response.status === "success") {
        console.log("Note updated successfully");
      } else {
        console.error("Failed to update note:", response);
      }
    }
  );
}
