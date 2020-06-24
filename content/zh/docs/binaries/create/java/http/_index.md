---
title: "http 接口调用场景"
linkTitle: "http 接口调用场景"
weight: 3
type: docs
description: >
  Java http 接口调用时的延迟、异常场景
---
## 参数

此处列举 http 支持的通用参数：

```text
--effect-count string     影响的请求条数
--effect-percent string   影响的请求百分比
--pid string              指定 java 进程号
--process string          指定 java 进程名
--timeout string          设定运行时长，单位是秒，通用参数
--httpclient3             作用 httpclient3 组件，即 Apache HttpClient 3.x
--httpclient4             作用 httpclient4 组件，即 Apache HttpClient 4.x
--rest                    作用 rest 组件，即 Spring Web 模块中的 RestTemplate
--uri                     请求 URL，不包含 querystring 部分，例如：http://127.0.0.1:8801/getName
```

各场景还有自身所独有的参数，可以在每个场景文档中查看

## 实验原理

## 常见问题

Q: 下发规则不生效

A: 在命令后添加 --debug，然后触发业务请求，查看应用进程用户目录下 ~/logs/chaosblade/chaosblade.log 日志，如下：

```text
2020-05-04 23:01:00 INFO  command: create, request: {"headers":{},"params":{"rest":"true","process":"http-client","debug":"true","action":"delay","suid":"d7ab31c151a045aa","time":"3000","uri":"http://127.0.0.1:8801/getName","target":"http"}}
2020-05-04 23:01:00 INFO  change log level to debug
2020-05-04 23:01:13 DEBUG http matchers: {"matchers":{"uri":"http://127.0.0.1:8801/getName"}}
2020-05-04 23:01:13 INFO  Match rule: {"action":{"name":"delay"},"actionName":"delay","matcher":{"matchers":{"rest":"true","uri":"http://127.0.0.1:8801/getName"}},"target":"http"}
```

command create 表示下发了 create 指令并开启 debug 日志，http matchers 表示获取请求的匹配数据，Match rule 表示请求和下发的命令匹配成功，延迟故障生效
