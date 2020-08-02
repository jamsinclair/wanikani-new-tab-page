/* global window document fetch Headers */
import getBrowser from './browser.js';

const b = getBrowser();
const HOUR = 3600000;

const getCacheBreakKey = async () => {
  const {cacheBreakKey = Date.now()} = await b.storage.local.get([
    'cacheBreakKey'
  ]);

  const now = Date.now();
  if (Number(cacheBreakKey) > now - HOUR) {
    return cacheBreakKey;
  }

  await b.storage.local.set({cacheBreakKey: now});
  return now;
};

const getSummary = async (apiToken) => {
  const headers = new Headers({
    'Wanikani-Revision': '20170710',
    Authorization: `Bearer ${apiToken}`
  });

  const cacheBreakKey = await getCacheBreakKey();
  return fetch(`https://api.wanikani.com/v2/summary?${cacheBreakKey}`, {
    headers
  })
    .then((response) => response.json())
    .then((response) => response.data);
};

const getLessonsCount = (data) => {
  return data && data.lessons[0].subject_ids.length;
};

const getReviewsCount = (data) => {
  const {reviews = []} = data || {};
  let count = 0;
  for (const review of reviews) {
    const availableAt = new Date(review.available_at);
    if (availableAt.getTime() > Date.now()) {
      break;
    }

    count += review.subject_ids.length;
  }

  return count;
};

const updateButtonCount = (selector, count) => {
  const element = document.querySelector(selector);

  if (count > 0) {
    element.classList.remove('button--disabled');
  }

  element.querySelector('.count').textContent = count;
};

const handleButtonClick = async (event) => {
  if (!event.metaKey) {
    event.preventDefault();
  }

  // Update the Cache Break key to a timestamp of now
  // Anticipating that when the user next opens a tab it will be
  // after they complete lesson or review
  await b.storage.local.set({cacheBreakKey: Date.now()});

  if (!event.metaKey) {
    window.location = event.target.href;
  }
};

const updatePage = (data) => {
  if (!data) {
    document.querySelector('.message').innerHTML =
      '⚠️ Your Wanikani data could not be retrieved at this time. Click below to manually check lessons and&nbsp;reviews.';
    document.querySelector('body').classList.remove('loading');
    return;
  }

  updateButtonCount('.lessons', getLessonsCount(data));
  updateButtonCount('.reviews', getReviewsCount(data));
  document.querySelector('body').classList.remove('loading');

  document.querySelectorAll('.button').forEach((element) => {
    element.addEventListener('click', handleButtonClick);
  });
};

const init = async () => {
  const {apiToken} = await b.storage.sync.get(['apiToken']);
  const summaryData = await getSummary(apiToken).catch((error) => {
    console.error(error);
    return null;
  });

  updatePage(summaryData);
};

init();
