/* global browser chrome */
const storageSync = {
  get(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, resolve);
    });
  },
  set(data) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(data, resolve);
    });
  }
};

const chromeBrowser = {
  storage: {
    sync: storageSync
  }
};

export default function getBrowser() {
  if (typeof browser === 'undefined') {
    return chromeBrowser;
  }

  return browser;
}
