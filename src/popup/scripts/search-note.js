import { getNoteById } from "./popup-data-handler";
import { renderNotes, setupNoteClickHandler } from "./popup-ui-handler";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const tagBubbles = document.querySelectorAll(".tag-bubble .tag-input");
  const resetButton = document.querySelector(".reset-button");
  const submitButton = document.querySelector(".submit-button");

  let activeFilter = null;

  function activateTagBubble(tagBubble) {
    tagBubbles.forEach((bubble) => {
      bubble.closest(".tag-bubble").classList.remove("active");
    });

    activeFilter = tagBubble;
    tagBubble.closest(".tag-bubble").classList.add("active");

    if (!tagBubble.closest(".tag-bubble").classList.contains("gold")) {
      searchInput.focus();
    }
  }

  const myNoteTag = [...tagBubbles].find((tag) =>
    tag.value.includes("My-Note")
  );
  ///
  console.log("search muy note ", myNoteTag)
  ///
  if (myNoteTag) {
    activateTagBubble(myNoteTag);
  }

  tagBubbles.forEach((tagBubble) => {
    tagBubble.addEventListener("click", function () {
      const tagContainer = tagBubble.closest(".tag-bubble");

      if (tagContainer.querySelector("input").value === "Favourite") {
        const isFavourite = tagContainer.classList.toggle("gold");
        tagBubble.setAttribute("data-value", isFavourite ? "true" : "false");
      } else {
        activateTagBubble(tagBubble);
      }
    });
  });

  // Handle note item clicks
  setupNoteClickHandler((noteId) => {
    const noteData = getNoteById(noteId);
    if (noteData) {
      const noteDataString = encodeURIComponent(JSON.stringify(noteData));
      window.location.href = `display-note.html?noteData=${noteDataString}`;
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && activeFilter) {
      event.preventDefault();

      const filterBubble = activeFilter.closest(".tag-bubble");
      const existingText = activeFilter.getAttribute("data-value") || "";
      const newText = searchInput.value.trim();

      if (newText) {
        activeFilter.setAttribute(
          "data-value",
          existingText ? `${existingText}, ${newText}` : newText
        );
        activeFilter.value = `${
          activeFilter.value.split(" ")[0]
        } (${activeFilter.getAttribute("data-value")})`;
        searchInput.value = "";
      }
    }
  });

  document.querySelectorAll(".cancel-filter").forEach((cancelButton) => {
    cancelButton.addEventListener("click", function () {
      const tagBubble = cancelButton.closest(".tag-bubble");
      const tagInput = tagBubble.querySelector(".tag-input");
      if (tagBubble.querySelector("input").value === "Favourite") {
        tagBubble.classList.remove("gold");
        tagInput.setAttribute("data-value", "false");
      } else {
        tagInput.removeAttribute("data-value");
        tagInput.value = tagInput.value.split(" ")[0];
        tagBubble.classList.remove("active");
      }
    });
  });

  resetButton.addEventListener("click", function () {
    tagBubbles.forEach((tagBubble) => {
      const tagContainer = tagBubble.closest(".tag-bubble");

      tagBubble.removeAttribute("data-value");
      tagBubble.value = tagBubble.value.split(" ")[0];
      tagContainer.classList.remove("active", "gold");

      if (tagContainer.querySelector("input").value === "Favourite") {
        tagBubble.setAttribute("data-value", "false");
      }
    });

    searchInput.value = "";

    if (myNoteTag) {
      activateTagBubble(myNoteTag);
    }
  });

  const urlNoteMap = new Map();

  submitButton.addEventListener("click", function () {
    const formData = {};

    tagBubbles.forEach((bubble) => {
      const key = bubble.value.split(" ")[0];
      const value = bubble.getAttribute("data-value") || "";
      formData[key] = value;
    });

    const formattedData = {
      isFavourite: formData["Favourite"] === "true",
      tag: formData["Tags"] ? [formData["Tags"]] : [],
      url: formData["URL"] || "",
      textNote: formData["My-Note"] || "",
    };

    chrome.runtime.sendMessage(
      {
        action: "searchNotesWithAllFilters",
        ...formattedData,
      },
      (response) => {
        renderNotes(response.matchingNotes);
      }
    );
  });
});