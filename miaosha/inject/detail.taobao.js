//2000代表2000毫秒=页面2秒刷新一次
document.write('<iframe width=100% height=100% frameborder=0 scrolling=yes>');
frames[0].location.href = document.location.href;
setInterval("frames[0].location.reload();",2000);

//间隔300毫检查是否有立即购买按键出来，自动点击，不用改
setInterval("frames[0].document.getElementById('J_LinkBuy').click();",300);

//间隔300毫检查是否有提交订单按键出来，自动点击，不用改
setInterval("frames[0].document.getElementsByClassName('go-btn')[0].click();",300);