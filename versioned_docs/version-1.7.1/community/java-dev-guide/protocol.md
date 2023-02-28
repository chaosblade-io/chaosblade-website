# 协议篇

本篇介绍 `chaosblade` 与 `chaosblade-exec-jvm` 之间通信接口 API，此 API 遵循《[混沌实验模型](https://github.com/chaosblade-io/chaosblade/wiki/混沌实验模型)》。

# 接口定义

`chaosblade-exec-jvm` 实现了 `create` 和 `destroy` 两个接口，分别是创建混沌实验以及销毁停止实验，以下我们拿 dubbo 应用举例，实施服务调用方调用 `com.example.HelloService@1.0.0` 服务延迟 3s 实验。

`chaosblade-exec-jvm` 基于 `jvm-sandbox` 内置的 jetty server 实现请求处理。

## create 命令

创建混沌实验，chaosblade 工具执行命令是:

```shell
blade create dubbo delay --time 3000 --service com.example.HelloService --version 1.0.0 --consumer
```

**url 请求：** `chaosblade/create?suid=su378dsn137s53bs8adcn&target=dubbo&action=delay&time=3000&service=com.example.HelloService&version=1.0.0&consumer=true`

其中请求参数为

```json
{
	"suid": "su378dsn137s53bs8adcn",
	"target": "dubbo",
	"action": "delay",
	"time": "3000",
	"service": "com.example.HelloService",
	"version": "1.0.0",
	"consumer": "true"
}
```

- `create`: 创建混沌实验请求
- `suid`: 请求参数，实验的 ID，后续停止实验会用到此 ID
- `target`: 请求参数，实验的组件目标，dubbo
- `action`: 请求参数，执行实验的场景，delay
- `time`: 请求参数，action 执行器所需参数，此处是延迟的时间
- `service`、`version`、`consumer`: 请求参数，实验匹配器，分别匹配服务名，服务版本，服务调用者

**注：**

- `suid`、`target`、`action` 是 create 请求的必要参数， `time`、`service`、`version`、`consumer` 参数根据 `target` 和 `action` 的不同而不同。
- 接收到请求，会根据 `target` 和 `action` 调用参数校验器，验证参数值是否合法，如果合法，则记录此次试验；
- 对应组件埋点触发时，如果查询到有此组件的实验，则获取匹配器所需参数，和下发的实验规则进行匹配，匹配成功，则调用场景执行器触发实验。

## destroy 命令

销毁混沌实验，chaosblade 工具执行命令是:

```
blade destroy su378dsn137s53bs8adcn
```

**url 请求：** `chaosblade/destroy?suid=su378dsn137s53bs8adcn`

其中请求参数是：

```
{
    "suid": "su378dsn137s53bs8adcn"
}
```

- `suid`: 请求参数，之前创建实验返回的 UID

**注：** 接收到 destroy 请求后，会删除与 UID 相对应的混沌实验规则。

# 使用场景

## 已经在使用 `jvm-sandbox`，想单独使用 `chaosblade-exec-jvm` 提供的故障注入的能力

将 `chaosblade-exec-jvm` 编译好的 jar 包放到 `jvm-sandbox` user_module 目录下，执行:

```
# 刷新 sandbox module
sh sandbox.sh -p PID -F

# 激活 chaosblade java agent
sh sandbox.sh -p PID -a chaosblade
```

然后调用 `create` 或者 `destroy` url 请求来创建、销毁实验。如果想了解 `chaosblade java agent` 支持哪些实验场景，可以查看编译后 `plugins/jvm.spec.yaml` 文件。

## 想基于 `chaosblade` 扩展其他语言应用故障注入的能力

要遵循《[混沌实验模型](https://github.com/chaosblade-io/chaosblade/wiki/混沌实验模型)》 实现，并且实现 `create` 和 `destory` 两个实验操作。