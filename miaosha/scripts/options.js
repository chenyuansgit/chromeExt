function $(id) {
  return document.getElementById(id);
}

function saveUser() {
  var linkName = $('linkName').value;
  var orderTime = $('orderTime').value;
  /*localStorage['savedMiaoshaTask'] = {
    linkName,
    orderTime
  };*/

  alert('设置成功:' + linkName + orderTime);
}

$('btnSave').onclick = function () {
  saveUser();
};