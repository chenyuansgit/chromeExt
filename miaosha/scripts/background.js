var taskList = [];

function DEBUG(msg) {
  console.log("[" + TimestampNoDate() + "] " + msg);
}

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}

function scheduleTime(task) {
  const {
    id,
    url,
    time
  } = task;
  var date = new Date();//现在时刻
  var dateIntegralPoint = new Date(time);

  const taskTimer = setTimeout(function () {
    //alert('run');
    // 刷新页面
    //chrome.tabs.update(id, {url});
    //alert("oldId:" + id);
    // 页面检查下单按钮
    //chrome.tabs.executeScript(id, {code: 'document.body.style.backgroundColor="red"'});
    //chrome.tabs.executeScript(id, {file: './scripts/order.js'});
    // todo: 在列表删除当前task
    sendMessageToContentScript({cmd: 'loop', value: '你好，我是popup！'}, function (response) {
       console.log("response：" + response);
    });

  }, dateIntegralPoint - date);
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
      clearTimeout(timer);
      scheduleTime(data);
    }
    sendResponse({taskList: taskList});
  } else if (request.type == "clearTask") {
    for (let i = 0; i < taskList.length; i++) {
      const timer = taskList[i].timer;
      clearTimeout(timer);
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