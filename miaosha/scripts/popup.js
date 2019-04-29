function $(id) {
  return document.getElementById(id);
}

// 设置默认值
function setDefaulValue(url) {
  var linkId = $('linkName');
  linkId.value = url;
  //linkId.value = document.location.href;
  //const bg = chrome.extension.getBackgroundPage();
  //linkId.value = bg.document.location.href;

  //alert(bg.document.location.href);

  var orderTimeId = $('orderTime');

  var d = new Date();
  var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
    + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  orderTimeId.value = datestring;
}

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  const url = tabs[0].url;

  var distRegex = /taobao|tmall.*!/;
  var loginRegex = /login.taobao.com/;

  var targetURL = 'https://favorite.taobao.com/item_collect.htm';
  if (loginRegex.test(url)) {
    alert("请先登录");
  } else if (!distRegex.test(url)) {
    alert("请切换到淘宝，并登录");
    chrome.tabs.create({url: targetURL});
  } else {
    chrome.tabs.getSelected(null, function (selected) {
      chrome.tabs.update(selected.id, {url: targetURL});
    });
  }

  setDefaulValue(url);

  // 保存任务
  function saveTask() {
    var url = $('linkName').value;
    var orderTime = $('orderTime').value;
    chrome.runtime.sendMessage({
      type: 'addTask',
      data: {
        id: tabs[0].id,
        url,
        time: orderTime
      }
    }, function (response) {
      alert("add result:" + JSON.stringify(response));
    });
  }

// 清空任务
  function clearTask() {
    var url = $('linkName').value;
    var orderTime = $('orderTime').value;
    chrome.runtime.sendMessage({
      type: 'clearTask',
      data: {
        url,
        time: orderTime
      }
    }, function (response) {
      alert("clear result:" + JSON.stringify(response));
    });
  }

  $('btnSave').onclick = function () {
    saveTask();
  };

  $('btnClear').onclick = function () {
    clearTask();
  };

});