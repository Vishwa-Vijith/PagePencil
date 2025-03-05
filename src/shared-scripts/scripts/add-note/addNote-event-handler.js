
import { setupTagEditor } from "./add-tags.js";
import { setupImageUpload } from "./image-handler.js";
import { getCurrentPageUrl } from "../get-url.js";
import { populateNoteData } from "./populate-note.js";

export const tagEditor = document.querySelector(".tag-editor");
export const tagContainer = document.querySelector(".tag-container");
export let isFavourite = false;

export async function setupEventListeners() {
  const backIcon = document.querySelector(".page-pencil-back-icon");
  const headerText = document.querySelector(".page-pencil-title");
  
  const imageUploadInput = document.getElementById("page-pencil-image-upload");
  const dropZone = document.querySelector(".drop-zone");
  const previewContainer = document.getElementById("image-preview-container");
  const cancelButton = document.getElementById("page-pencil-cancel-button");
  const starButton = document.querySelector(".star-button");
  const starIcon = document.querySelector(".star-button svg");
  const saveButton = document.getElementById("page-pencil-save-note-button");
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("source");
  const metadataParam = urlParams.get("metadata");
  const noteDataParam = urlParams.get("noteData");
  const currentPageUrl = await getCurrentPageUrl();

  let metadata = {};
  let noteData = null;
  let noteIdForEdit = null;

  if (metadataParam) {
    metadata = JSON.parse(decodeURIComponent(metadataParam));
  }

  if (noteDataParam) {
    try {
      noteData = JSON.parse(decodeURIComponent(noteDataParam));
      populateNoteData(noteData);
      noteIdForEdit = noteData.id;
    } catch (error) {
      console.error("Failed to parse noteData:", error);
    }
  }

  backIcon.addEventListener("click", () => {
    if (source === "contentScript") {
      window.parent.postMessage({ action: "closePopup" }, "*");
    } else {
      window.location.href = "index.html";
    }
  });

  headerText.addEventListener("click", () => {
    if (source === "contentScript") {
      window.parent.postMessage({ action: "closePopup" }, "*");
    } else {
      window.location.href = "index.html";
    }
  });

  if (tagEditor) {
    setupTagEditor(tagEditor, tagContainer);
  }

  if (imageUploadInput && dropZone && previewContainer) {
    setupImageUpload(imageUploadInput, dropZone, previewContainer);
  }

  cancelButton.addEventListener("click", () => {
    if (source === "contentScript") {
      window.parent.postMessage({ action: "closePopup" }, "*");
    } else {
      window.location.href = "index.html";
    }
  });

  starButton.addEventListener("click", () => {
    const isFavorite = starIcon.getAttribute("fill") === "#FFD700";
    starIcon.setAttribute("fill", isFavorite ? "#0c130e" : "#FFD700");
    isFavourite = !isFavourite;
  });

  saveButton.addEventListener("click", async () => {
    // Get the tags
    const tags = Array.from(tagContainer.children).map((tagElement) => {
      const tagText = tagElement.querySelector("span")?.textContent.trim();
      return { name: tagText };
    });

    if (tags.length < 1 || tags.length > 5) {
      alert("Please select between 1 and 5 tags.");
      return;
    }

    // Get the text note
    const textNoteInput = document.getElementById("text-note-input");
    const textNote = textNoteInput ? textNoteInput.value.trim() : "";

    if (!textNote) {
      alert("Please provide a text note.");
      return;
    }

    // Get the image blob
    const imageSrc = previewContainer.querySelector("img")?.src || "";
    let imageBlob = null;

    if (imageSrc) {
      try {
        imageBlob = await getImageBlob(imageSrc);
        if (!(imageBlob instanceof Blob)) {
          throw new Error("The image is not a valid Blob.");
        }
      } catch (error) {
        console.error("Error converting image to Blob:", error);
        imageBlob = null;
      }
    }

    // Prepare note data
    const noteData = {
      id: noteIdForEdit,
      url: currentPageUrl || "",
      startContainerXPath: metadata.startContainerXPath || "",
      startOffset: metadata.startOffset || "",
      endContainerXPath: metadata.endContainerXPath || "",
      endOffset: metadata.endOffset || "",
      selectedText: metadata.selectedText || "",
      tag: tags,
      textNote: textNote,
      visualNote: imageBlob,
      isFavourite: isFavourite,
    };

    // Determine the action based on whether an 'id' is provided (edit or save)
    const action = noteData.id ? "updateNoteToDatabase" : "saveNoteToDatabase";

    chrome.runtime.sendMessage(
      {
        action: action,
        ...noteData,
      },
      (response) => {
        if (response?.success) {
          alert(response.message || "Note saved successfully!");
        } else {
          alert(
            "Failed to save the note: " + (response?.message || "Unknown error")
          );
        }
      }
    );
  });
}


document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});
