/*
MIT License
Handles background tasks for the extension, including database operations and tab management.
*/

/**
 * Opens the add-note popup.
 * @param {Object} metadata - Metadata for the note.
 */
export function openAddNotePopup(metadata) {
  if (document.getElementById("add-note-popup")) return;

  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
  `;

  const iframe = document.createElement("iframe");
  iframe.id = "add-note-popup";
  iframe.src = chrome.runtime.getURL(
    `../shared-scripts/html/add-note.html?source=contentScript&metadata=${encodeURIComponent(
      JSON.stringify(metadata)
    )}`
  );

  iframe.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 350px;
    height: 580px;
    transform: translate(-50%, -50%);
    border: none;
    z-index: 10001;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(iframe);

  overlay.addEventListener("click", () => {
    iframe.remove();
    overlay.remove();
  });

  window.addEventListener("message", (event) => {
    if (event.data.action === "closePopup") {
      iframe.remove();
      overlay.remove();
    }
  });
}

/**
 * Opens the show-note popup.
 * @param {Object} highlight - The note data.
 */
export function openShowNotePopup(highlight) {
  if (document.getElementById("show-note-popup")) return;

  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
  `;

  const iframe = document.createElement("iframe");
  iframe.id = "show-note-popup";
  iframe.src = chrome.runtime.getURL(
    `shared-scripts/html/display-note.html?source=contentScript&metadata=${encodeURIComponent(
      JSON.stringify(highlight)
    )}`
  );

  iframe.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 350px;
    height: 580px;
    transform: translate(-50%, -50%);
    border: none;
    z-index: 10001;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(iframe);

  overlay.addEventListener("click", () => {
    iframe.remove();
    overlay.remove();
  });

  window.addEventListener("message", (event) => {
    if (event.data.action === "closePopup") {
      iframe.remove();
      overlay.remove();
    }
  });
}
