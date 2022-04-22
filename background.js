const STORED_TOPICS = "storedTopics";
const CONTEXT_MENU = {
  title: "Başlığı Gizle",
  contexts: ["link"],
  documentUrlPatterns: ["http://localhost/*", "https://eksisozluk.com/**"],
  id: "998",
};
const STORED_TOPICS_DICT_INITIAL_DECLARATION = {
  [STORED_TOPICS]: JSON.stringify([]),
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(STORED_TOPICS_DICT_INITIAL_DECLARATION);
  chrome.contextMenus.create(CONTEXT_MENU);
});

var handleTopicStorage = async ({ linkUrl }) => {
  var createdTopic = await createNewTopic(linkUrl);
  saveTopic(createdTopic);
};

var createNewTopic = async (topicUrl) => {
  const url = new URL(topicUrl);
  return {
    id: extractTopicIdFromUrl(url),
    url: removeQueryFromTopicUrl(topicUrl),
    self: extractTopicFromUrl(url),
  };
};

const extractTopicIdFromUrl = ({ pathname }) => {
  return pathname.substring(pathname.indexOf("--") + 2);
};

const extractTopicFromUrl = ({ pathname }) => {
  return pathname.substring(pathname.indexOf("/") + 1).split("--")[0];
};

const removeQueryFromTopicUrl = (url) => {
  return url.split("?")[0];
};

const saveTopic = async (topic) => {
  var { storedTopics } = await chrome.storage.local.get([STORED_TOPICS]);
  var topics = JSON.parse(storedTopics);
  topic.push(topic);
  storedTopics = JSON.stringify(topics);
  chrome.storage.local.set({ [STORED_TOPICS]: storedTopics });
};

chrome.contextMenus.onClicked.addListener(({ linkUrl }, { id }) => {
  console.log(linkUrl);
  chrome.scripting.executeScript(
    {
      target: { tabId: id },
      func: removeTopicFromView,
      args: [linkUrl],
    },
    () => {}
  );
  //handleTopicStorage(link);
});

function removeTopicFromView(linkUrl) {
  var topicList = document.getElementsByClassName("topic-list partial")[0];

  for (var topic of topicList.children) {
    var topicAnchor = topic.getElementsByTagName("a")[0];
    if (topicAnchor === undefined) continue;
    var topicId = topicAnchor.href.substring(
      topicAnchor.href.indexOf("--") + 2
    );
    var topicIdToBeRemoved = linkUrl.substring(linkUrl.indexOf("--") + 2);
    if (topicId === topicIdToBeRemoved) {
      topic.remove();
    }
  }
}
