document.getElementById("hello").onclick = async function () {
  var { storedTopics } = await chrome.storage.local.get(["storedTopics"]);
  console.log(storedTopics);
};
