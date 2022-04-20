console.log("script has been injected");

chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
  console.log(response.farewell);
});

// console.log("script has been injected");
// var gizliBaslik = ["are", "world", "you", "how", ""];

// var baslikList = document.getElementsByClassName("hello")[0];

// for (var gizlenen of gizliBaslik) {
//   var baslikListLength = baslikList.children.length;
//   for (var i = baslikListLength - 1; i >= 0; i--) {
//     if (gizlenen === baslikList.children[i].innerHTML) {
//       baslikList.removeChild(baslikList.children[i]);
//     }
//   }
// }
