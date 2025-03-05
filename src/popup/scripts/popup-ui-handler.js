// Handles rendering notes and managing UI updates.

const notesListContainer = document.getElementById("notes-list");

/**
 * Renders notes in the UI.
 * @param {Array} notes - The notes to render.
 */
export function renderNotes(notes) {
  notesListContainer.innerHTML = "";

  if (notes.length === 0) {
    notesListContainer.innerHTML = `
      <ul>
        <li class="note-item">
          <span class="note-content">
            No notes found!
          </span>
        </li>
      </ul>
    `;
    return;
  }

  const notesList = document.createElement("ul");

  notes.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.classList.add("note-item");
    noteItem.dataset.noteId = note.id;

    noteItem.innerHTML = `
      <span class="note-content">
        ${note.textNote || "Untitled Note"}
      </span>
      <span class="show-note-dropdown-icon" data-note-id="${note.id}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </span>
    `;
    notesList.appendChild(noteItem);
  });

  notesListContainer.appendChild(notesList);
}


/**
 * Handles note item clicks.
 * @param {Function} callback - The callback to execute when a note is clicked.
 */
export function setupNoteClickHandler(callback) {
  notesListContainer.addEventListener("click", (event) => {
    const icon = event.target.closest(".show-note-dropdown-icon");
    if (icon) {
      const noteId = icon.dataset.noteId;
      callback(noteId);
    }
  });
}
