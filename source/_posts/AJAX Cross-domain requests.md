---
title: AJAX Cross-domain requests
date: 2016-06-16 18:48:58
tags: [ajax,jsonp]
categories : web
---

## AJAX跨域请求 - JSONP

struts2中的配置：
``` xml
<result name="json" type="json">
    <param name="callbackParameter">callback</param>
</result>
```
``` java
//jsonp回调函数名(callback)
String jsonpCallback = HttpServletRequest.getParameter("callbackFunction");
//返回jsonp格式数据  
out.println(jsonpCallback+"("+resultJson.toString()+")");
```
<!--more-->
JQuery：\$.ajax/ \$.getJSON支持jsonp格式的跨域，但是只支持GET方式，暂不支持POST
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="jquery-2.1.4.min.js"></script>
    <script src="test.js"></script>
</head>
<body>
    <input type="button" onclick="javascript:getdata();" value="submit">
</body>
</html>
```
``` javascript
function getdata() {
    $.ajax({
        url : 'http://10.1.1.3:8080/test/testAction',
        type : 'get',
        data : {
            'username' : 'test'
        },
        dataType : 'jsonp',
        // 重写JSONP请求的回调函数名称。该值用于替代"url?callback=?"中的"callback"部分。
        jsonp : 'callback',
        crossDomain : true,
        // 为JSONP请求指定一个回调函数名。这个值将用来取代jQuery自动生成的随机函数名。
        // 从jQuery 1.5开始，你也可以指定一个函数来返回所需的函数名称
        jsonpCallback : "successCallback",
        success : function(data){
            console.log(data);
        },
        error : function(data){
            console.log("something wrong");
        }
    });
}
function successCallback(data) {
    console.log(data);
}
```


