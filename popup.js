var list = document.getElementById("eksi-baslik-gizle-list");

const initTopics = async () => {
  var { storedTopics } = await chrome.storage.local.get("storedTopics");
  var topics = JSON.parse(storedTopics);

  const createTopicAnchor = (topic) => {
    var anchor = document.createElement("a");
    anchor.appendChild(document.createTextNode(topic.self));
    anchor.href = topic.url;
    return anchor;
  };

  const createACol = (className) => {
    var col = document.createElement("div");
    col.classList.add(className);
    return col;
  };

  const createDeleteBtn = () => {
    var deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "sil";
    deleteBtn.onclick = (e) => deleteTopic(e);
    return deleteBtn;
  };

  const deleteTopic = (e) => {
    var topicRow = e.srcElement.parentElement.parentElement;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === topicRow.id) {
        topicRow.remove();
        topics.splice(i, 1);
        chrome.storage.local.set({ storedTopics: JSON.stringify(topics) });
      }
    }
  };

  for (var topic of topics) {
    var row = document.createElement("div");
    row.id = topic.id;

    var col1 = createACol("topic-column");
    var col2 = createACol("sil-column");

    var anchor = createTopicAnchor(topic);
    col1.appendChild(anchor);

    var deleteBtn = createDeleteBtn();
    col2.appendChild(deleteBtn);

    row.appendChild(col1);
    row.appendChild(col2);

    list.appendChild(row);
  }
};

initTopics();
