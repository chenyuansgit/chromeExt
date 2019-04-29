var taskList = [];
var maxTryTime = 1;

function DEBUG(msg) {
  console.log("[" + TimestampNoDate() + "] " + msg);
}

function sendMessageToContentScript(id, message, callback) {
  chrome.tabs.sendMessage(id, message, function (response) {
    if (callback) callback(response);
  });
}

function scheduleTime(task) {
  const {
    id,
    url,
    time
  } = task;


  var i = 0;
  const taskTimer = setInterval(function () {
    var date = new Date();//现在时刻
    var dateIntegralPoint = new Date(time);

    var nowTime = date.getTime();
    var toTime = dateIntegralPoint.getTime();

    //console.log(i, nowTime - toTime >= 0, i < maxTryTime);
    /*if (nowTime - toTime >= 0 && i < maxTryTime) {
      i++;
      console.log("update count:", i, date, dateIntegralPoint, new Date());
      // 刷新页面
      chrome.tabs.update(id, {url});
      let hasSend = false;
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tabId == id && !hasSend) {
          hasSend = true;
          console.log('send Loop:', new Date());
          sendMessageToContentScript(id, {cmd: 'loop', value: '你好，我是popup！'}, function (response) {
            console.log("response：" + response + ' ' + new Date());
            clearInterval(taskTimer);
          });
        }
      });

    }*/
    if (nowTime - toTime >= 0 && i < maxTryTime) {
      i++;
      console.log("update count:", i, date, dateIntegralPoint, new Date());
      // 打开页面
      chrome.tabs.create({url});
    }
  }, 100);
  task.timer = taskTimer;
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
      scheduleTime(data);
    } else {
      const timer = findItem.timer;
      clearInterval(timer);
      scheduleTime(data);
    }
    sendResponse({taskList: taskList});
  } else if (request.type == "clearTask") {
    for (let i = 0; i < taskList.length; i++) {
      const timer = taskList[i].timer;
      clearInterval(timer);
    }
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