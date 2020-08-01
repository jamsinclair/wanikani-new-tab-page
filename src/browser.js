/* global browser chrome */
const getStorageContainerWithPromises = (container) => ({
  get(keys) {
    return new Promise((resolve) => {
      container.get(keys, resolve);
    });
  },
  set(data) {
    return new Promise((resolve) => {
      container.set(data, resolve);
    });
  }
});

const chromeBrowser = {
  storage: {
    local: getStorageContainerWithPromises(chrome.storage.local),
    sync: getStorageContainerWithPromises(chrome.storage.sync)
  }
};

export default function getBrowser() {
  if (typeof browser === 'undefined') {
    return chromeBrowser;
  }

  return browser;
}
