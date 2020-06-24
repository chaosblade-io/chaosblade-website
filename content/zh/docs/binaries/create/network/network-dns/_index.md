---
title: "DNS 解析异常实验场景"
linkTitle: "DNS 解析异常实验场景"
weight: 2
type: docs
description: > 
    篡改 DNS 域名解析实验场景
---
## 介绍

此实验会修改本地的 hosts，篡改域名地址映射。

网络丢包场景主要验证域名解析异常的情况下，系统的自我容错能力。

## 参数

```text
--domain string    域名 (必要参数)
--ip string        映射的 ip (必要参数)
--timeout string   设定运行时长，单位是秒，通用参数
```

## 案例

```text
# www.baidu.com 域名不可访问
blade create network dns --domain www.baidu.com --ip 10.0.0.0

{"code":200,"success":true,"result":"9e7a168079c68fad"}

# 使用 ping www.baidu.com 来验证，会发现访问不通。
```

## 实现原理

修改 `/etc/hosts`

## 常见问题

Q：`{"code":604,"success":false,"error":"10.0.0.0 www.baidu.com #chaosblade has been exist exit status 1"}`

A：表示此条映射已存在，销毁之前的实验即可。如果找不到 UID，可以直接修改 /etc/hosts ，删除包含 #chaosblade 注释的项即可
