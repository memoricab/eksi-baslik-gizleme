const STORED_TITLES = "storedTitles";
const CONTEXT_MENU = {
  title: "Başlığı Gizle",
  contexts: ["link"],
  documentUrlPatterns: ["http://localhost/*", "https://eksisozluk.com/**"],
  id: "998",
};
const STORED_TITLES_DICT_INITIAL_DECLARATION = {
  [STORED_TITLES]: JSON.stringify([]),
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(STORED_TITLES_DICT_INITIAL_DECLARATION);
  chrome.contextMenus.create(CONTEXT_MENU);
});

var handleTitleStorage = async ({ linkUrl }) => {
  var createdTitle = await createNewTitle(linkUrl);
  saveTitle(createdTitle);
};

var createNewTitle = async (titleUrl) => {
  const url = new URL(titleUrl);
  return {
    id: extractTitleIdFromUrl(url),
    url: removeQueryFromTitleUrl(titleUrl),
    self: extractTitleFromUrl(url),
  };
};

const extractTitleIdFromUrl = ({ pathname }) => {
  return pathname.substring(pathname.indexOf("--") + 2);
};

const extractTitleFromUrl = ({ pathname }) => {
  return pathname.substring(pathname.indexOf("/") + 1).split("--")[0];
};

const removeQueryFromTitleUrl = (url) => {
  return url.split("?")[0];
};

const saveTitle = async (title) => {
  var { storedTitles } = await chrome.storage.local.get([STORED_TITLES]);
  var titles = JSON.parse(storedTitles);
  if (isTitleAlreadyExists(title.id, titles)) return;

  titles.push(title);
  storedTitles = JSON.stringify(titles);
  chrome.storage.local.set({ [STORED_TITLES]: storedTitles });
};

const isTitleAlreadyExists = (titleId, titles) => {
  for (var title of titles) {
    if (Object.values(title).includes(titleId)) return true;
  }
  return false;
};

chrome.contextMenus.onClicked.addListener((link, { id }) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: id },
      func: removeTopicFromView,
      args: [link],
    },
    () => {}
  );
  //handleTitleStorage(link);
});

function removeTopicFromView({ linkUrl }) {
  var topicList = document.getElementsByClassName("topic-list partial")[0];
  console.log(topicList);

  for (var topic of topicList.children) {
    var topicAnchor = topic.getElementsByTagName("a")[0];
    var topicId = topicAnchor.href.substring(
      topicAnchor.href.indexOf("--") + 2
    );
    var topicIdToBeRemoved = linkUrl.substring(linkUrl.indexOf("--") + 2);
    if (topicId === topicIdToBeRemoved) {
      topic.remove();
    }
  }
}
