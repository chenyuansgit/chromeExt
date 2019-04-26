function $(id) {
  return document.getElementById(id);
}

// 设置默认值
var linkId = $('linkName');
//linkId.value= document.location.href;
const bg = chrome.extension.getBackgroundPage();
linkId.value = bg.document.location.href;

alert(bg.document.location.href);

var orderTimeId = $('orderTime');

var d = new Date();
var datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
  + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
orderTimeId.value = datestring;

// 保存任务
function saveTask() {
  var url = $('linkName').value;
  var orderTime = $('orderTime').value;
  chrome.runtime.sendMessage({
    type: 'addTask',
    data: {
      url,
      time: orderTime
    }
  }, function (response) {
    alert("result:" + JSON.stringify(response));
  });

  //alert('设置成功:' + url + orderTime);
}

$('btnSave').onclick = function () {
  saveTask();
};