---
title: centos6-shadowsocks
date: 2016-04-19 21:18:05
tags: [shadowsocks,centos]
categories : centos
---

## 在centos6上部署shadowsocks服务端简易步骤
``` bash
yum -y update
yum -y install m2crypto
yum -y install python-setuptools && easy_install pip
pip install shadowsocks
```
<!--more-->
### 修改配置文件:
``` bash
vi /etc/shadowsocks.json
```
### 添加如下内容:
``` bash
{
"server":"youripaddress",
"server_port":"443",
"lcoal_address":1080,
"password":"yourpassword",
"timeout":600,
"method":"aes-256-cfb",
"fast_open":false
}
```

### 启动shadowsocks
``` bash
ssserver -c /etc/shadowsocks.json -d start
```
