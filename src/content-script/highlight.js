/*
MIT License
Handles background tasks for the extension, including database operations and tab management.
*/

import { openShowNotePopup } from "./popup-handler.js"; 
import { getNodeByXPath } from "./utils.js"; 
/**
 * Highlights the selected text.
 * @param {Object} highlight - The note data.
 */
export function highlightTextInContrastColour(highlight) {
  const { startContainerXPath, startOffset, endContainerXPath, endOffset } =
    highlight;
    
  if(startContainerXPath && startOffset && endContainerXPath && endOffset) {
    const startNode = getNodeByXPath(startContainerXPath);
    const endNode = getNodeByXPath(endContainerXPath);
    if (!startNode || !endNode || startNode !== endNode) {
      console.error("Selection must be within a single element.");
      return;
    }

    const range = document.createRange();
    range.setStart(endNode, startOffset);
    range.setEnd(endNode, endOffset);

    const highlightSpan = document.createElement("span");
    highlightSpan.className = "highlighted-text";
    highlightSpan.addEventListener("click", () => openShowNotePopup(highlight));

    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);
    window.getSelection().removeAllRanges();
  }
}


