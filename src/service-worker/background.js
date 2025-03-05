/*
MIT License
Handles background tasks for the extension, including database operations and tab management.
*/

import { getCurrentActiveTabUrl } from "./tabs.js";
import {
  saveNoteToDatabase,
  getNotesFromDatabaseByURL,
  updateNoteByIdInDatabase,
  deleteNoteByIdInDatabase
} from "./notes-handler.js";
import { searchNotesByFilters } from "./search.js"
import { getAllFavouriteNotesFromDatabase } from "./notes-handler.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, ...payload } = request;

  switch (action) {
    case "getCurrentPageUrl":
      getCurrentActiveTabUrl()
        .then((url) => sendResponse({ success: true, url }))
        .catch((error) => sendResponse({ success: false, message: error.message }));
      break;

    case "saveNoteToDatabase":
      saveNoteToDatabase(payload, sendResponse);
      break;

    case "getNotesFromDatabase":
      getNotesFromDatabaseByURL(payload.url, sendResponse);
      break;

    case "getAllFavouriteNotes":
      getAllFavouriteNotesFromDatabase(sendResponse);
      break;

    case "updateNoteToDatabase":
      updateNoteByIdInDatabase(payload, sendResponse);
      break;

    case "deleteNoteInDatabase":
      deleteNoteByIdInDatabase(payload, sendResponse);
      break;

    case "searchNotesWithAllFilters":
      searchNotesByFilters(payload, sendResponse);
      break;

    default:
      sendResponse({ success: false, message: "Unknown action." });
      break;
  }

  return true;
});

