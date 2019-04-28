var taskList = [];
var taskStart = false;

function DEBUG(msg) {
  console.log("[" + TimestampNoDate() + "] " + msg);
}

function scheduleTime(link, runDate) {
  var date = new Date();//现在时刻
  var dateIntegralPoint = new Date(runDate);

  setTimeout(function () {
    chrome.tabs.create({url: link});
  }, dateIntegralPoint - date);//用户登录后的下一个整点执行
}

// 点击图标： 将当前页面加入任务
chrome.browserAction.onClicked.addListener(function (tab) {
  alert('点击');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "taskList") {
    sendResponse({taskList: taskList});
  } else if (request.type == "addTask") {
    const data = request.data;
    var findItem = taskList.find(function (item) {
      return item.url === data.url;
    });
    if (!findItem) {
      taskList.push(data);
    }
    sendResponse({taskList: taskList});
  } else if (request.type == "clearTask") {
    taskList = [];
    sendResponse({taskList: taskList});
  }
});

// initialize options data
chrome.storage.sync.get({
  savedMiaoshaTask: []
}, function (items) {
  // 为变赋值
  taskList = items.savedMiaoshaTask;
  for (var i = 0; i < taskList.length; i++) {
    DEBUG('url=' + taskList[i].url);
    DEBUG('time=' + taskList[i].time);
  }
});