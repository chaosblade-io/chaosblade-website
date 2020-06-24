---
title: "Java Servlet 实验场景"
linkTitle: "Java Servlet 实验场景"
weight: 2
type: docs
description: > 
    Java Web 请求延迟、异常场景
---
Servlet 是 Java 的 web 的接口规范，Java web 服务器都遵循此规范实现。本场景主要模拟 Java Web 请求延迟、异常场景。

## 参数

servlet 通用参数

```text
--effect-count string     影响的请求条数
--effect-percent string   影响的请求百分比
--method string           HTTP 请求类型, 例如： GET, POST, or PUT.
--pathinfo string         已废弃
--pid string              java进程号
--process string          java进程名
--querystring string      请求参数，例如http://localhost:8080/dubbodemo/async?name=friend&timeout=2000 中 querystring的值是 name=friend&timeout=2000
--requestpath string      请求 URI，不包含 Context 部分，例如 http://localhost:8080/dubbodemo/async?name=friend&timeout=2000，则 requestpath 的值是 /async，注意要带 /
--servletpath string      已废弃
```

## 实验原理


## 常见问题

Q: 下发规则不生效

A: 在命令后添加 --debug，然后触发业务请求，查看应用进程用户目录下 `logs/chaosblade/chaosblade.log` 日志，如下：

```go
2019-12-09 21:15:12 DEBUG servlet matchers: {"matchers":{"querystring":"name=bobo","servletpath":"/servlet/path","method":"GET","requestpath":"/servlet/path"}}
2019-12-09 21:15:12 INFO  Match rule: {"action":{"name":"delay"},"actionName":"delay","matcher":{"matchers":{}},"target":"servlet"}
```

servlet matchers 日志表示获取应用的匹配数据，Match rule 表示和下发的命令匹配。