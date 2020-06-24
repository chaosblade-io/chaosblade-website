---
title: "http 请求抛自定义异常"
linkTitle: "http 请求抛自定义异常"
weight: 2
type: docs
description: >
  Java http 请求抛自定义异常
---
{{% pageinfo color="primary" %}}
命令可以简写为 `blade c http tce`
{{% /pageinfo %}}

## 参数

以下是此场景特有参数，通用参数详见：[blade create http](../)

```text
--exception string           异常类，带全包名，必须继承 java.lang.Exception 或 java.lang.Exception 本身
--exception-message string   指定异常类信息，默认值是 chaosblade-mock-exception
```

## 案例

http-client 进程的 `/httpdemo/hello` 接口：内部通过 `restTemplate` 组件访问 `http://127.0.0.1:8801/getName` 接口获取返回值。

指定以上 http 请求抛出 `java.lang.Exception` 异常，影响 2 条请求：

```shell
blade c http throwCustomException --exception java.lang.Exception --uri http://127.0.0.1:8801/getName --rest --process http-client --effect-count 2

{"code":200,"success":true,"result":"06540c7b4171a7ae"}
```

验证结果，故障注入前：

![before_chaos](https://tvax2.sinaimg.cn/large/ad5fbf65ly1gg38fntcpij20dw023wes.jpg)

故障注入后：

![after_exception](https://tva2.sinaimg.cn/large/ad5fbf65ly1gg38kfdj45j20dw01yaaj.jpg)

查看日志：前两次请求打印了 `Match rule` 日志，说明匹配成功，故障生效；第 3 次打印了 `Limited by`，说明匹配成功，但是由于 `effect-count` 参数的限制，所以此请求没有抛出异常

```go
2020-05-05 00:48:16 INFO  command: create, request: {"headers":{},"params":{"exception":"java.lang.Exception","rest":"true","process":"http-client","effect-count":"2","action":"throwCustomException","suid":"06540c7b4171a7ae","uri":"http://127.0.0.1:8801/getName","target":"http"}}
2020-05-05 00:48:32 INFO  Match rule: {"action":{"name":"throwCustomException"},"actionName":"throwCustomException","matcher":{"matchers":{"rest":"true","effect-count":"2","uri":"http://127.0.0.1:8801/getName"}},"target":"http"}
2020-05-05 00:48:32 INFO  Match rule: {"action":{"name":"throwCustomException"},"actionName":"throwCustomException","matcher":{"matchers":{"rest":"true","effect-count":"2","uri":"http://127.0.0.1:8801/getName"}},"target":"http"}
2020-05-05 00:48:33 INFO  Limited by: {"action":{"name":"throwCustomException"},"actionName":"throwCustomException","matcher":{"matchers":{"rest":"true","effect-count":"2","uri":"http://127.0.0.1:8801/getName"}},"target":"http"}
```

停止实验：

```shell
blade d 06540c7b4171a7ae
```
