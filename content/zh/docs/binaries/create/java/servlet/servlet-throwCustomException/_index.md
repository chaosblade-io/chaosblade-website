---
title: "Java web 请求异常"
linkTitle: "Java web 请求异常"
weight: 2
type: docs
description: > 
    Java web 请求异常
---
## 参数

以下是此场景特有参数，通用参数详见：[blade create servlet](../)

```text
--exception string           异常类，带全包名，必须继承 java.lang.Exception 或 java.lang.Exception 本身
--exception-message string   指定异常类信息，默认值是 chaosblade-mock-exception
```

## 案例

访问 `http://localhost:8080/dubbodemo/hello?code=1` 请求异常，影响 3 条请求

```shell
blade c servlet throwCustomException --exception org.springframework.beans.BeansException --exception-message mock-beans-exception --requestpath /hello --effect-count 3

{"code":200,"success":true,"result":"d4a63f4f59f76f4a"}
```

访问请求进行验证。

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758963109248/15759566028886.jpg?raw=true)

查看日志，通过日志也可以看出

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758963109248/15759567480821.jpg?raw=true)


## 实验原理

## 常见问题
