---
title: "指定类方法调用延迟"
linkTitle: "指定类方法调用延迟"
weight: 1
type: docs
description: > 
    Java jvm 指定类方法调用延迟
---
## 参数

以下是此场景特有参数，通用参数详见：[blade create jvm](../)

```text
--effect-count string     影响的请求条数
--effect-percent string   影响的请求百分比
--time string             延迟时间，单位是毫秒，必填项
--offset string           延迟时间上下偏移量，比如 --time 3000 --offset 1000，则延迟时间范围是 2000-4000 毫秒
```

## 案例

业务方法通过 `future` 获取返回值，代码如下：

```java
@RequestMapping(value = "async")
@ResponseBody
public String asyncHello(final String name, long timeout) {
    if (timeout == 0) {
        timeout = 3000;
    }
    try {
        FutureTask futureTask = new FutureTask(new Callable() {
            @Override
            public Object call() throws Exception {
                return sayHello(name);
            }
        });
        new Thread(futureTask).start();
        return (String)futureTask.get(timeout, TimeUnit.MILLISECONDS);
    } catch (TimeoutException e) {
        return "timeout, " + e.getMessage() + "\n";
    } catch (Exception e) {
        return e.getMessage() + "\n";
    }
}
```

我们对 `sayHello` 方法调用注入 4 秒延迟故障，`futureTask.get(2000, TimeUnit.MILLISECONDS)`  会发生超时返回：

```shell
blade c jvm delay --time 4000 --classname=com.example.controller.DubboController --methodname=sayHello --process tomcat

{"code":200,"success":true,"result":"d6ebea0dc28b6ab3"}
```

注入故障前：

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758728083067/15758802870730.jpg?raw=true)


注入故障后：

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758728083067/15758806204281.jpg?raw=true)

停止实验：

```shell
blade d d6ebea0dc28b6ab3
```
