/*
MIT License
Handles IndexedDB operations for storing, retrieving, and modifying notes.
*/

let db = null;
let dbPromise = null;

/**
 * Opens the IndexedDB database.
 * @returns {Promise<IDBDatabase>} - Resolves with the database instance.
 */
export async function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const dbName = "PagePencil";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("PagePencil")) {
        const objectStore = db.createObjectStore("PagePencil", {
          keyPath: "id",
          autoIncrement: true,
        });

        objectStore.createIndex("url", "url", { unique: false });
        objectStore.createIndex("startContainerXPath", "startContainerXPath", {
          unique: false,
        });
        objectStore.createIndex("startOffset", "startOffset", {
          unique: false,
        });
        objectStore.createIndex("endContainerXPath", "endContainerXPath", {
          unique: false,
        });
        objectStore.createIndex("endOffset", "endOffset", { unique: false });
        objectStore.createIndex("selectedText", "selectedText", {
          unique: false,
        });
        objectStore.createIndex("tag", "tag", {
          unique: false,
          multiEntry: true,
        });
        objectStore.createIndex("textNote", "textNote", { unique: false });
        objectStore.createIndex("visualNote", "visualNote", { unique: false });
        objectStore.createIndex("isFavourite", "isFavourite", {
          unique: false,
        });
        objectStore.createIndex(
          "byCompositeKey",
          [
            "url",
            "startContainerXPath",
            "startOffset",
            "endContainerXPath",
            "endOffset",
            "selectedText",
          ],
          { unique: false }
        );
      } 
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error)
    };
  });

  return dbPromise;
}

/**
 * Starts a transaction on the specified object store.
 * @param {string} storeName - The object store name.
 * @param {string} [mode="readonly"] - The transaction mode.
 * @returns {IDBObjectStore} - The object store.
 */
export function getTransaction(storeName, mode = "readonly") {
  if (!db) throw new Error("Database not initialized");
  return db.transaction(storeName, mode).objectStore(storeName);
}