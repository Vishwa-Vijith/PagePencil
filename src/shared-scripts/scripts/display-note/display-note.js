import { populateDisplayNoteData } from "./display-populate-note"; 
import { setupDisplayEventListeners } from "./displayNote-event-handler";

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  let pageSource = null;
  const source = params.get("source");
  pageSource = source;

  let noteDataString = params.get("noteData") || params.get("metadata");
  if (noteDataString) {
    try {
      return JSON.parse(decodeURIComponent(noteDataString));
    } catch (error) {
      console.error("Failed to parse noteData:", error);
      return null;
    }
  }
  return null;
};

document.addEventListener("DOMContentLoaded", () => {
    const noteData = getQueryParams();
    if (noteData) {
      populateDisplayNoteData(noteData);
    } else {
      console.error("No valid noteData found in query parameters.");
    }

    setupDisplayEventListeners(noteData);
});
