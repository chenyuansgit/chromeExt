var taskList = [];


function DEBUG(msg) {
  console.log("[" + TimestampNoDate() + "] " + msg);
}

// 点击图标： 将当前页面加入任务
chrome.browserAction.onClicked.addListener(function (tab) {
  var distRegex = /\*.taobao|tmall.\*/;
  var loginRegex = /login.taobao.com/;

  if (loginRegex.test(tab.url)) {
    alert("请先登录");
  } else if (!distRegex.test(tab.url)) {
    //chrome.tabs.create({ url: targetURL });
    alert("请切换到淘宝，并登录");
  } else {
    /*chrome.tabs.getSelected(null, function(selected){
      chrome.tabs.update(selected.id, { url: targetURL });
    });*/
    const url = tab.url;
    const task = taskList.find(function (item) {
      return item.linkName === url;
    });
    if (!task) {
      taskList.push({
        linkName: url,
        time: ''
      });
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "page") {
    var page = request.page;
    DEBUG("check page: " + page);
    sendResponse({page: page + 1});
  }
});

// initialize options data
chrome.storage.sync.get({
  savedMiaoshaTask: []
}, function (items) {
  // 为变赋值
  taskList = items.savedMiaoshaTask;
  for (var i = 0; i < taskList.length; i++) {
    DEBUG('url=' + taskList[i].linkName);
    DEBUG('time=' + taskList[i].orderTime);
  }
});