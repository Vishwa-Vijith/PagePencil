

export function createTagBubble(tagValue, tagContainer) {
  const tagBubble = document.createElement("div");
  tagBubble.classList.add("tag");

  const tagText = document.createElement("span");
  tagText.textContent = tagValue;
  tagBubble.appendChild(tagText);

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-tag");
  removeButton.textContent = "x";
  removeButton.addEventListener("click", () => {
    tagContainer.removeChild(tagBubble);
  });

  tagBubble.appendChild(removeButton);
  tagContainer.appendChild(tagBubble);
}

export function setupTagEditor(tagEditor, tagContainer) {
  tagEditor.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagValue = tagEditor.value.trim();
      const maxTags = 5;
      if (tagValue && tagContainer.childElementCount < maxTags) {
        createTagBubble(tagValue, tagContainer);
        tagEditor.value = "";
      } else if (tagContainer.childElementCount >= maxTags) {
        alert("Maximum of 5 tags allowed.");
      }
    }
  });
}
