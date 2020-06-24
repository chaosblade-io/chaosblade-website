---
title: "Java web 请求延迟"
linkTitle: "Java web 请求延迟"
weight: 1
type: docs
description: > 
    Java web 请求延迟
---
## 参数

以下是此场景特有参数，通用参数详见：[blade create servlet](../)

```text
--time string             延迟时间，单位是毫秒，必填项
--offset string           延迟上下浮动时间，例如 --time 3000 --offset 1000，延迟时间的取值范围是 2000-4000 毫秒
```

## 案例

访问 `http://localhost:8080/dubbodemo/servlet/path?name=bob` 请求延迟 3 秒，影响 2 条请求

```shell
blade c servlet delay --time 3000 --requestpath /servlet/path --effect-count 2

{"code":200,"success":true,"result":"154c866919172119"}
```

访问请求进行验证。

请求参数是 `name=family`，延迟 2 秒，延迟时间上下浮动 1 秒，影响范围是 50% 的请求，同时开启 debug 日志用于排查问题，命令如下：

```shell
blade c servlet delay --time 2000 --offset 1000 --querystring name=family --effect-percent 50 --debug

{"code":200,"success":true,"result":"49236d2406d168f4"}
```

监控 应用进程用户目录 `/logs/chaosblade/chaosblade.log` 日志

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758962690342/15759492777798.jpg?raw=true)

可以看到下发了 `create` 指令并开启 debug 日志。

请求两次 `http://localhost:8080/dubbodemo/servlet/path?name=bob` ，由于参数 `querystring` 和下发的命令不匹配，所以没有生效。

随后请求两次 `http://localhost:8080/dubbodemo/servlet/path?name=family`，第一次打印了 `Match rule` 日志，说明匹配成功，延迟生效；第二次打印了 `limited by`，说明匹配成功，但是由于 `effect-percent` 参数的限制，所以场景被限制，此请求没有发生延迟。

## 实验原理

## 常见问题
