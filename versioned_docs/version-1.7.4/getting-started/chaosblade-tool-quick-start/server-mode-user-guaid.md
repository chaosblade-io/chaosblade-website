---
title: Server 模式使用简介
---

本文档主要介绍如何通过 Server 模式进行混沌工程实验

## 启动server
后台通过 `blade server` 暴露出 web 服务，上层可通过 http 调用
### 命令
```
start       启动 server 模式, 暴露 web 服务
	start 命令参数
		-p, --port string   服务端口号，默认是 9526
stop        停止 server 模式, 关闭 web 服务
```
### 案例
```
# 启动 server 模式，服务端口是 8080
blade server start --port 8080
success, listening on 8080


# 停止 blade server
blade server stop

{"code":200,"success":true,"result":"pid is 12619"}
```
##  server调用下发实验
上层通过 http 请求调用，请求格式是 `chaosblade?cmd=具体命令`，例如执行 CPU 满载，则请求是 `chaosblade?cmd=create%20cpu%20fullload`
### 案例
在执行 http 请求前，确定目标机器中已经启动 server 服务，并没有停止（假定如上，其服务端口为8080）
```
# 触发 CPU 负载 50% 场景
curl "http://xxx.xxx.xxx.xxx:8080/chaosblade?cmd=create%20cpu%20load%20--cpu-percent%2050"

{"code":200,"success":true,"result":"e08a64a9af02c393"}

# 销毁实验场景
curl "http://xxx.xxx.xxx.xxx:8080/chaosblade?cmd=destroy%20e08a64a9af02c393"
```

## 常见问题

Q: {"code":605,"success":false,"error":"the chaosblade has been started. If you want to stop it, you can execute blade server stop command"} 
A：服务已经启动

Q: {"code":500,"success":false,"error":"time="2019-09-25T11:36:28.321495762+08:00" level=error msg="start blade server error, listen tcp :8080: bind: address already in use"\n"} 
A：端口已被占用
