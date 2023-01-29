---
id: blade create network dns
---

# 模拟篡改DNS解析实验

篡改 dns 域名解析实验场景

## 介绍
此实验会修改本地的 hosts，篡改域名地址映射。

网络丢包场景主要验证域名解析异常的情况下，系统的自我容错能力。

## 命令
* `blade create network dns -h`

## 参数

| 参数名       | 说明             | 类型     | 值                 |
|-----------|----------------|--------|-------------------|
| `domain`  | 域名 (必要参数)      | string | 例：`www.baidu.com` |
| `ip`      | 映射的 ip (必要参数)  | string | 例: `10.0.0.1`     |
| `timeout` | 设定的运行时长，单位为秒   | int    |                   |



## 案例
```text
# www.baidu.com 域名不可访问
blade create network dns --domain www.baidu.com --ip 10.0.0.0

{"code":200,"success":true,"result":"9e7a168079c68fad"}

# 使用 ping www.baidu.com 来验证，会发现访问不通。
```

## 实现原理
修改 /etc/hosts

## 常见问题
Q：{"code":604,"success":false,"error":"10.0.0.0 www.baidu.com #chaosblade has been exist exit status 1"}
A：表示此条映射已存在，销毁之前的实验即可。如果找不到 UID，可以直接修改 /etc/hosts ，删除包含 #chaosblade 注释的项即可
