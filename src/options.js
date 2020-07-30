/* global document */
import getBrowser from './browser.js';
const b = getBrowser();

const save = (event) => {
  event.preventDefault();
  b.storage.sync.set({
    apiToken: document.querySelector('#apiToken').value
  });
};

const restore = async () => {
  const input = document.querySelector('#apiToken');
  const options = await b.storage.sync.get(['apiToken']);
  input.value = options.apiToken || '';
  input.disabled = false;
};

restore();
document.querySelector('form').addEventListener('submit', save);
