---
title: "指定类方法的返回值"
linkTitle: "指定类方法的返回值"
weight: 2
type: docs
description: > 
    指定类方法的返回值，仅支持基本类型、null 和 String 类型的返回值。
---
## 参数

以下是此场景特有参数，通用参数详见：[blade create jvm](../)

```text
--effect-count string     影响的请求条数
--effect-percent string   影响的请求百分比
--value string     返回指定值，仅支持基本类型和字符串类型，如果想返回 null，可以设置为 --value null 。必选项
```

## 案例

指定 `com.example.controller.DubboController` 类，下面业务方法返回 "hello-chaosblade"

```java
@RequestMapping(value = "hello")
@ResponseBody
public String hello(String name, int code) {
    if (name == null) {
        name = "friend";
    }
    StringBuilder result = null;
    try {
        result = new StringBuilder(sayHello(name));
    } catch (Exception e) {
        return e.getMessage() + "\n";
    }
    return result.toString() + "\n";
}
```

故障注入命令如下：

```shell
blade c jvm return --value hello-chaosblade --classname com.example.controller.DubboController --methodname hello --process tomcat
```

故障注入之前：

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758728222521/15758791534572.jpg?raw=true)

故障注入之后：

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758728222521/15758792025977.jpg?raw=true)

停止实验：

```shell
blade d d31e24dea782a275
```

上述代码调用 `sayHello` 方法，我们对 `sayHello` 方法注入返回 null `故障，sayHello` 方法如下：

```java
private String sayHello(String name) throws BeansException {
    demoService = (DemoService)SpringContextUtil.getBean("demoService");
    StringBuilder result = new StringBuilder();
    result.append(demoService.sayHello(name));
    return result.toString();
}
```

执行以下命令：

```shell
blade c jvm return --value null --classname com.example.controller.DubboController --methodname sayHello --process tomcat
```

故障注入之后：

![](https://github.com/chaosblade-io/chaosblade-help-doc/blob/master/zh-CN/v0.6.0/media/15758728222521/15758793979757.jpg?raw=true)
