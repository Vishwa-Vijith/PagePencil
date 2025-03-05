/*
MIT License
The main content script file
*/

import { getNotesFromDatabase } from "./contentScript-data-handler.js"; 
import { createDropdown } from "./drop-down.js"; 
import { getXPath, isValidSelection } from "./utils.js";

// Fetch notes on page load
window.onload = () => getNotesFromDatabase();

// Handle text selection
document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.toString().trim() === "") return;
  
  const selectedText = selection.toString().trim();
  if (selectedText) {
    const range = selection.getRangeAt(0);
    const metadata = {
      selectedText,
      startContainerXPath: getXPath(range.startContainer),
      startOffset: range.startOffset,
      endContainerXPath: getXPath(range.endContainer),
      endOffset: range.endOffset,
    };  

    const existingDropdown = document.querySelector("#page-pencil-custom-dropdown");

    if (isValidSelection(metadata) && !existingDropdown) {
      createDropdown(event.clientX, event.clientY, metadata);
    }
  }
});
