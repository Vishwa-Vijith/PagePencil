

import { previewImage } from "../add-note/image-handler";

const renderTags = (tags) => {
  const tagContainer = document.querySelector(".note-header .tag-container");
  tagContainer.innerHTML = "";

  if (Array.isArray(tags)) {
    tags.forEach((tag) => {
      const tagBubble = document.createElement("div");
      tagBubble.classList.add("note-tag");
      tagBubble.textContent = tag.name || tag; // Handle both object and string tag formats
      tagContainer.appendChild(tagBubble);
    });
  } else {
    console.warn(
      "Tags should be an array of objects or strings. Received:",
      tags
    );
  }
};

const renderFavoriteIcon = (isFavourite) => {
  const favoriteIconContainer = document.querySelector(".favorite-icon");
  favoriteIconContainer.innerHTML = "";
  const starIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  starIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  starIcon.setAttribute("height", "20px");
  starIcon.setAttribute("width", "20px");
  starIcon.setAttribute("viewBox", "0 0 24 24");

  const starPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  starPath.setAttribute(
    "d",
    "M12 17.75l-3.5 2.25 1-4.25-3.5-3.25 4.5-.5 1.5-4.5 1.5 4.5 4.5 .5-3.5 3.25 1 4.25z"
  );
  starPath.setAttribute("transform", "scale(1.6) translate(-6 -6)");
  starIcon.style.fill = isFavourite ? "#FFD700" : "#0e180f";
  starIcon.appendChild(starPath);
  favoriteIconContainer.appendChild(starIcon);
};

const renderTextNote = (textNote) => {
  const textNoteContainer = document.querySelector(".text-note");
  textNoteContainer.textContent = textNote || "No content available.";
};

export function populateDisplayNoteData(noteData) {
     const tags = Array.isArray(noteData.tag) ? noteData.tag : [];
     renderTags(tags);
     renderFavoriteIcon(noteData.isFavourite || false);
     renderTextNote(noteData.textNote || "");
     previewImage(noteData.imageUrl || null);    
}
