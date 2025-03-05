/*
MIT License
Handles active tab management and content script communication.
*/

/**
 * Retrieves the active tab URL.
 */
export async function getCurrentActiveTabUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) return tabs[0].url;
  throw new Error("No active tab found.");
}

/**
 * Notifies the content script that the database was updated.
 */
export async function notifyContentScript() {
  try {
    const currentUrl = await getCurrentActiveTabUrl();
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
      if (tab.id && tab.url === currentUrl) {
        chrome.tabs.sendMessage(tab.id, { action: "databaseUpdated" });
        chrome.tabs.reload(tab.id);
        break;
      }
    }
  } catch (error) {
    console.error("Error notifying content script:", error);
  }
}
