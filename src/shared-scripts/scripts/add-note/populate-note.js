// src/shared-scripts/scripts/noteManager.js

import { createTagBubble } from "./add-tags.js";
import { tagContainer } from "./addNote-event-handler.js";
import { isFavourite } from "./addNote-event-handler.js";

export function populateNoteData(noteData) {
  // Populate tags
  if (noteData.tag && Array.isArray(noteData.tag)) {
    noteData.tag.forEach((tag) => {
      createTagBubble(tag.name, tagContainer);
    });
  }

  // Populate text note
  const textNoteInput = document.getElementById("text-note-input");
  if (textNoteInput && noteData.textNote) {
    textNoteInput.value = noteData.textNote;
  }

  // Populate image if present
  if (noteData.imageUrl) {
    previewImageFromUrl(noteData.imageUrl);
  }

  // Populate favorite status
  const starIcon = document.querySelector(".star-button svg");
  if (starIcon && noteData.isFavourite) {
    starIcon.setAttribute("fill", "#FFD700");
    isFavourite = true;
  }
}

export function previewImageFromUrl(imageUrl) {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      img.style.maxWidth = "100%";
      img.style.borderRadius = "10px";
      dropZone.style.display = "none";
      previewContainer.innerHTML = "";
      previewContainer.appendChild(img);
    })
    .catch((error) =>
      console.error("Failed to fetch and display image:", error)
    );
}

export function getImageBlob(imageSrc) {
  return fetch(imageSrc)
    .then((response) => response.blob())
    .catch((error) => {
      console.error("Error fetching the image:", error);
      return null;
    });
}
