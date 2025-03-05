export async function setupDisplayEventListeners(noteData) {

    const backIcon = document.querySelector(".back-icon");
    const editButton = document.querySelector(".edit-button");
    const deleteButton = document.querySelector(".delete-button");
    let noteIdForDelete = -1223;

    backIcon.addEventListener("click", () => {
      if (source === "contentScript") {
        window.parent.postMessage({ action: "closePopup" }, "*");
      } else {
        window.location.href = "index.html";
      }
    });

    if (editButton && noteData) {
      editButton.addEventListener("click", () => {
        const noteDataString = encodeURIComponent(JSON.stringify(noteData));
        window.location.href = `add-note.html?source=displayNote&noteData=${noteDataString}`;
      });
    }

    deleteButton.addEventListener("click", () => {
      noteIdForDelete = noteData.id;
      if (!noteIdForDelete) {
        alert("No note selected to delete.");
        return;
      }
      chrome.runtime.sendMessage(
        { action: "deleteNoteInDatabase", id: noteIdForDelete },
        (response) => {
          if (response?.success) {
            goBack();
          } else {
            goBack();
          }
        }
      );
    });
}