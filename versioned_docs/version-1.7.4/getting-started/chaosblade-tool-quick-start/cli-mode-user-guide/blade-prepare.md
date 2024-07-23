---
title: blade prepare
---

本文档主要介绍`blade prepare`命令使用

## Usage

应用层场景在`create`注入之前，将应用层 agent 挂载到目标进程中，目前只有`Java`和`C++`应用层场景需要。
该命令只有在**主机**上进行**应用层故障**（这里只支持 jvm\cpluse）注入（create）之前是需要使用（k8s 容器环境会自动进行 agent 挂载，不需要手动执行），其相对应的是`./blade create jvm **`和`./blade create cpluse *`相关执行演练实验场景

```shell
Usage:
  blade prepare
  blade prepare [command]

Aliases:
  prepare, p

blade check [target] [flags]
```

## Exec

进入解压包本地所放置的路径，可通过`./blade prepare -h`查看所有支持的 target，目前支持两种

- Java：挂载相应的 Java Agent 到目标 Java 进程中
- Cplus：挂载相应的 C++ Agent 到目标 C++进程中

```
[root@test chaosblade]# ./blade prepare -h
Prepare to experiment, for example, attach agent to java process or deploy agent to kubernetes cluster.

Usage:
  blade prepare
  blade prepare [command]

Aliases:
  prepare, p

Examples:
prepare jvm --process tomcat

Available Commands:
  cplus       Active cplus agent.
  jvm         Attach a type agent to the jvm process

Flags:
  -h, --help   help for prepare

Global Flags:
  -d, --debug   Set client to DEBUG mode

Use "blade prepare [command] --help" for more information about a command.
```

## Options

可通过`./blade prepare jvm -h`查看具体 Jvm prepare 时支持参数。以下以 Java 为例，cplus 类似

```
[root@test chaosblade]# ./blade prepare jvm -h
Attach a type agent to the jvm process for java framework experiment.

Usage:
  blade prepare jvm

Examples:
prepare jvm --process tomcat

Flags:
  -a, --async             whether to attach asynchronously, default is false
  -e, --endpoint string   the attach result reporting address. It takes effect only when the async value is true and the value is not empty
  -h, --help              help for jvm
  -j, --javaHome string   the java jdk home path
  -n, --nohup             used to internal async attach, no need to config
      --pid string        the target java process id
  -P, --port int          the port used for agent server
  -p, --process string    the java application process name (required)
  -u, --uid string        used to internal async attach, no need to config

Global Flags:
  -d, --debug   Set client to DEBUG mode
```

| **Name, shorthand**   | **Default** | **Dencryption**                                                                                                   |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| -a, --async           | false       | whether to attach asynchronously                                                                                  |
| -e, --endpoint string |             | the attach result reporting address. It takes effect only when the async value is true and the value is not empty |
| -j, --javaHome        | $JAVA_HOME  | the java jdk home path                                                                                            |
| -P, --port            |             | the port used for agent server                                                                                    |
| --pid                 |             | the target java process id（Choose one of pid and process）                                                       |
| -p, --process         |             | the java application process name（Choose one of pid and process）                                                |
| -u, --uid             |             | used to internal async attach, no need to config                                                                  |
| -d, --debug           | false       | Set client to DEBUG mode for log                                                                                  |

## Examples

### 指定 pid 执行 java agent 挂载

对 pid 为 `26652` 的 Java 进程进行探针挂载

```
blade prepare jvm --pid 26652
# 命令也可简写为
blade p jvm --pid 26652
```

### 指定 process 执行 java agent 挂载

对进程中含有`tomcat`关键词的 Java 进程进行探针挂载

```
[root@test chaosblade]# ./blade prepare jvm --process tomcat
```

### 卸载 java agent

执行成功，会返回实验准备的 UID，例如：

```
{"code":200,"success":true,"result":"2552c05c6066dde5"}
```

`2552c05c6066dde5` 就是实验准备对象的 UID，执行卸载操作需要用到此 UID，例如

```
blade revoke 2552c05c6066dde5
# 命令也可简写为
blade r 2552c05c6066dde5
```

如果 UID 忘记，可通过以下命令查询

```
blade status --type prepare --target jvm
# 命令也可简写为：
blade s --type p --target jvm
```

挂载 java agent 操作是个比较耗时的过程，在未返回结果前请耐心等待

## 常见问题

Q: {"code":500,"success":false,"error":"cannot get port from local, please execute prepare command first"}
A: 没有挂载所需的 java agent，执行 prepare jvm 命令挂载

Q: {"code":602,"success":false,"error":"less --process or --pid flags"}
A: 缺少必要参数用于指定 java 应用进程
