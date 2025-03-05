// src/shared-scripts/scripts/utils.js

export function getCurrentPageUrl() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "getCurrentPageUrl" }, (response) => {
      if (response?.success) {
        resolve(response.url);
      } else {
        reject(new Error("Failed to get current page URL"));
      }
    });
  });
}
