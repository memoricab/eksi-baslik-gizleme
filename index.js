const removeTopicsFromView = async () => {
  const extracTopicIdFromAnchor = (topicAnchor) => {
    return topicAnchor.href
      .substring(topicAnchor.href.indexOf("--") + 2)
      .split("?")[0];
  };

  var { storedTopics } = await chrome.storage.local.get("storedTopics");
  var topics = JSON.parse(storedTopics);
  var topicUlElement = document.getElementsByClassName("topic-list partial")[0];
  var topicLiElements = topicUlElement.children;

  for (var i = topicLiElements.length - 1; i >= 0; i--) {
    if (topics.length === 0) break;
    var topicEl = topicLiElements[i];
    var topicAnchor = topicEl.getElementsByTagName("a")[0];
    if (topicAnchor === undefined) continue;
    var topicElId = extracTopicIdFromAnchor(topicAnchor);

    for (var k = topics.length - 1; k >= 0; k--) {
      var topic = topics[k];
      if (topic.id === topicElId) {
        topicUlElement.removeChild(topicEl);
        topics.splice(k, 1);
      }
    }
  }
};

removeTopicsFromView();
