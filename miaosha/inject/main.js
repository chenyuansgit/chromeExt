function DetermineStartPage() {
  var message = {
    type : "page",
    page : 0
  };

  chrome.runtime.sendMessage(message, function(response) {
    if (response && response.page) {
       //
    }
  });
}

function main() {
  DEBUG("recording...");
  window.scrollTo(0,document.body.scrollHeight);  // to see pageNo.
  DetermineStartPage();
}


main();