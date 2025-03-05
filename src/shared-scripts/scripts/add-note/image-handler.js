

export function previewImage(file, dropZone, previewContainer) {
  if(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "100%";
      img.style.borderRadius = "10px";
      dropZone.style.display = "none";
      previewContainer.innerHTML = "";
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

export function setupImageUpload(imageUploadInput, dropZone, previewContainer) {
  imageUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      previewImage(file, dropZone, previewContainer);
    } else {
      alert("Please select a valid image file.");
    }
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("dragging");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragging");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragging");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      previewImage(file, dropZone, previewContainer);
    } else {
      alert("Please drop a valid image file.");
    }
  });
}
