/*
MIT License
Handles background tasks for the extension, including database operations and tab management.
*/

import { openAddNotePopup } from "./popup-handler.js";
/**
 * Creates a dropdown for selected text.
 * @param {number} clientX - The X position of the mouse event.
 * @param {number} clientY - The Y position of the mouse event.
 * @param {Object} metadata - Metadata for the selected text.
 */
export function createDropdown(clientX, clientY, metadata) {
  const { startContainerXPath, endContainerXPath } = metadata;
  const dropdownWrapper = document.createElement("div");
  dropdownWrapper.id = "page-pencil-custom-dropdown";
  dropdownWrapper.style.position = "absolute";
  dropdownWrapper.style.top = `${clientY + window.scrollY + 15}px`;
  dropdownWrapper.style.left = `${clientX + window.scrollX + 15}px`;
  dropdownWrapper.style.zIndex = "999999";

  const shadow = dropdownWrapper.attachShadow({ mode: "open" });
  const dropdown = document.createElement("div");
  dropdown.className = "page-pencil-custom-dropdown";
  dropdown.innerHTML = `
    <style>
      .page-pencil-custom-dropdown {
        position: absolute;
        background-color: #233E2F;
        border-radius: 12px;
        padding: 5px 10px;
        height: 40px;
        z-index: 9999;
        display: flex;
        gap: 10px;
        box-shadow: 0 4px 8px #34FD8E;
        transition: opacity 0.5s ease;
        white-space: nowrap;
        max-width: 300px;
        overflow: hidden;
      }
    .page-pencil-dropdown-icon {
        cursor: pointer !important;
        font-size: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 100% !important;
        width: 40px !important;
        color: #ccf3ce !important;
        transition: color 0.2s ease, transform 0.2s ease !important;
        background: none !important;
        border: none !important;
        z-index: 10001 !important;
    }

    .page-pencil-custom-dropdown .page-pencil-dropdown-icon:hover {
        color: #34FD8E !important;
        transform: scale(1.1) !important;
    }

    .page-pencil-custom-dropdown .page-pencil-dropdown-icon:active {
        color: #34FD8E !important;
    }

    .page-pencil-custom-dropdown .page-pencil-dropdown-icon svg {
        width: 24px !important;
        height: 24px !important;
        fill: currentColor !important;
        display: block !important;
    }
    </style>
  `;

  const copyButton = createButton("Copy", copySvgIcon, () => {
    navigator.clipboard.writeText(metadata.selectedText);
    dropdown.remove();
    dropdownWrapper.remove();
    window.getSelection().removeAllRanges();
  });

  const noteButton = createButton("Make Note", noteSvgIcon, () => {
    openAddNotePopup(metadata);
    window.getSelection().removeAllRanges();
    dropdown.remove();
    dropdownWrapper.remove();
  });

  const closeButton = createButton("Close Dropdown", closeSvgIcon, () => {
    window.getSelection().removeAllRanges();
    dropdownWrapper.remove();
  });

  dropdown.appendChild(copyButton);
  if (startContainerXPath === endContainerXPath)
    dropdown.appendChild(noteButton);
  dropdown.appendChild(closeButton);

  shadow.appendChild(dropdown);
  document.body.appendChild(dropdownWrapper);

  setTimeout(() => {
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.remove();
        dropdownWrapper.remove();
      }
    });
  }, 100);
}

/**
 * Creates a button for the dropdown.
 * @param {string} title - The button title.
 * @param {string} icon - The SVG icon.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} - The button element.
 */
function createButton(title, icon, onClick) {
  const button = document.createElement("button");
  button.className = "page-pencil-dropdown-icon";
  button.setAttribute("title", title);
  button.innerHTML = icon;
  button.addEventListener("click", onClick);
  return button;
}

const copySvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M760-200H320q-33 0-56.5-23.5T240-280v-560q0-33 23.5-56.5T320-920h280l240 240v400q0 33-23.5 56.5T760-200ZM560-640v-200H320v560h440v-360H560ZM160-40q-33 0-56.5-23.5T80-120v-560h80v560h440v80H160Zm160-800v200-200 560-560Z" /></svg>`;

const noteSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z" /></svg>`;

const closeSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;
