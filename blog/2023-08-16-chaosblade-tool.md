---
title: 混沌工程之 ChaosBlade 故障注入百宝箱
authors: binbin
tags: [ chaosblade ]
description: 本文将重点介绍 ChaosBlade Tool 的架构以及实现细节。
hide_table_of_contents: false
---
> 转自：https://mp.weixin.qq.com/s?__biz=Mzg3MzgxMjc3NA==&amp;mid=2247484052&amp;idx=1&amp;sn=4a452ed452e26dfc8f6607857a46cb98&amp;chksm=cedb04ddf9ac8dcb1e85df5de6c5c159b5578949b7e828cdd7f1ee23802eb47d1d441a227c05&token=1141223089&lang=zh_CN#rd
> 来源：微信公众号(柠檬汁Code)

# 前言

在[上文](https://mp.weixin.qq.com/s?__biz=Mzg3MzgxMjc3NA==&amp;mid=2247484031&amp;idx=1&amp;sn=4bfc81c1ee268dc0c8d529a4b5fc9949&amp;chksm=cedb0436f9ac8d202f021e6b3e635e08573ce29d14591c9376f7594a623983ebd87103d915f6&token=842742047&lang=zh_CN#rd)中对 ChaosBlade 进行了整体介绍，其中主要分为 ChaosBlade Box 以及 ChaosBlade Tool 两大部分，ChaosBlade Box 提供了可视化的管理控制台。真正的故障注入能力是由 ChaosBlade Tool 提供的。 本文将重点介绍 ChaosBlade Tool 的架构以及实现细节。

# ChaosBlade Tool

ChaosBlade Tool 是一个故障注入工具箱，它本身并不是一个实际项目/工程，它是由一个 CLI 项目和多个故障执行器组成，ChasoBlade Tool 架构如下：

![](/img/2023-08-16-chaosblade-tool/tool-1.png)

1.  ChaosBlade Cli
 - [ChaosBlade Cli](https://github.com/chaosblade-io/chaosblade) 项目：主要负责故障指令生成，解析故障注入指令，故障指令分发，以及记录故障的状态

2.  ChaosBlade OS

- [ChaosBlade OS](https://github.com/chaosblade-io/chaosblade-exec-os) 执行器：主要负责基础资源类的故障注入，例如 CPU，内存，网络，磁盘等

3. ChaosBlade JVM

- [ChaosBlade JVM](https://github.com/chaosblade-io/chaosblade-exec-jvm) 执行器：主要负责 Java 应用的故障注入，例如 Dubbo，Http，JVM 等等

4. ChaosBlade Docker

- [ChaosBlade Docker](https://github.com/chaosblade-io/chaosblade-exec-docker) 执行器：主要负责针对 Docker 环境下的故障注入，例如针对某个 Docker 容器进行基础资源故障，删除指定 Docker 容器等

5. ChaosBlade K8S

-  [ChaosBlade K8S](https://github.com/chaosblade-io/chaosblade-operator) 执行器：主要负责针对 K8S 环境下的 Pod，Node，Container 进行故障注入，支持基础资源故障，删除 Pod 等。K8S 的执行器和其他执行器稍有不同，是在 Cli 项目中直接调用 K8S 集群创建 CRD，通过 Operator 来实现的故障注入。这里先大概了解，后面会在 K8S 故障注入源码分析中详细介绍
6. ChaosBlade CRI

- [ChaosBlade CRI](https://github.com/chaosblade-io/chaosblade-exec-cri) 执行器：主要负责对于容器运行插件（兼容 CRI）的容器进行故障注入，容器运行时插件（Container Runtime Interface，简称 CRI）是 Kubernetes v1.5 引入的容器运行时接口，它将 Kubelet 与容器运行时解耦，例如 Docker、Containerd 等容器运行时都是 CRI 的实现，后续社区计划将 [ChaosBlade Docker](https://github.com/chaosblade-io/chaosblade-exec-docker) 执行器废弃，改用 ChaosBlade CRI 执行器

7. ChaosBlade C++

-   [ChaosBlade C++](https://github.com/chaosblade-io/chaosblade-exec-cplus) 执行器：主要负责对 C++服务进行故障注入，利用 GDB 实现。提供修改返回值，变量值，调用延迟等故障注入能力

8. ChaosBlade Middleware

-  [ChaosBlade Middleware](https://github.com/chaosblade-io/chaosblade-exec-middleware) 执行器: 主要负责对中间件进行故障注入，目前支持 nginx 的重启，销毁，配置变更，修改返回值等

9. ChaosBlade Cloud

-  [ChaosBlade Cloud](https://github.com/chaosblade-io/chaosblade-exec-cloud/tree/main/exec/aliyun) 执行器：主要负责对各种云平台进行故障注入，例如阿里云的 ECS 的上线/下线/重启、公网 IP 的解绑、安全组的修改等等。


# ChaosBlade Cli

## 介绍

Cli 是一个独立的项目，打包编译后生成二进制可执行程序，它主要负责故障指令生成，解析故障注入指令，故障指令分发，以及记录故障的状态。用户可以直接运行它进行各种场景的故障注入以及故障恢复等操作。 

下面我将通过实际使用案例对 CLI 项目进行详细介绍。

## 故障注入命令

我们可以在 [Release](https://github.com/chaosblade-io/chaosblade/releases) 页面下载最新版本的 ChaosBlade,解压后的结构如下：

下面以创建 "指定随机两个核满载" 实验为例。直接运行 blade 二进制文件，执行后会返回执行结果以及当前故障的唯一 id。

``` shell
./blade create cpu load --cpu-count 2
{"code":200,"success":true,"result":"d05c13c7101933c7"}
```

运行成功后在当前机器上将会启动一个 chaos_burncpu 的进程，将占用机器的 2 核 CPU。

![](/img/2023-08-16-chaosblade-tool/tool-2.png)

其他场景的故障注入命令，可以参考[官网说明](https://chaosblade.io/docs)，具体的故障场景能力以及实现细节，将在后续的执行器篇详细介绍。

## 故障模型

通过上面的使用样例，我们来聊一下故障模型，在上面的 CPU 满载的执行命令中，可以拆分为四部分。

1.  对什么做混沌实验(CPU)

2.  混沌实验实施的范围是是什么(默认当前机器 Host)

3.  具体实施什么实验(满载 Load)

4.  实验生效的匹配条件有哪些(仅对其中两核 CPU 满载，cpu-list 2)


Chaosblade 通过以上四个部分将，将故障注入抽象出以下模型：

![](/img/2023-08-16-chaosblade-tool/tool-3.png)

-   Target：实验靶点，指实验发生的组件，例如 容器、应用框架（Dubbo、Redis、Zookeeper）等。

-   Scope：实验实施的范围，指具体触发实验的机器或者集群等。

-   Matcher：实验规则匹配器，根据所配置的 Target，定义相关的实验匹配规则，可以配置多个。由于每个 Target 可能有各自特殊的匹配条件，比如 RPC 领域的 HSF、Dubbo，可以根据服务提供者提供的服务和服务消费者调用的服务进行匹配，缓存领域的 Redis，可以根据 set、get 操作进行匹配。

-   Action：指实验模拟的具体场景，Target 不同，实施的场景也不一样，比如磁盘，可以演练磁盘满，磁盘 IO 读写高，磁盘硬件故障等。如果是应用，可以抽象出延迟、异常、返回指定值（错误码、大对象等）、参数篡改、重复调用等实验场景。


## CLI 指令

目前在 CLi 项目中支持多种操作指令，可以通过如下命令进行查看（对于这些 CLI 指令，如何生成的将在源码分析中介绍）

``` shell
./blade help


An easy to use and powerful chaos engineering experiment toolkit


Usage:
  blade [command]


Available Commands:
  check       Check the environment for chaosblade
  create      Create a chaos engineering experiment
  destroy     Destroy a chaos experiment
  help        Help about any command
  prepare     Prepare to experiment
  query       Query the parameter values required for chaos experiments
  revoke      Undo chaos engineering experiment preparation
  server      Server mode starts, exposes web services
  status      Query preparation stage or experiment status
  version     Print version info


Flags:
  -d, --debug   Set client to DEBUG mode
  -h, --help    help for blade


Use "blade [command] --help" for more information about a command.


```

## 故障状态

可以通过如下命令，查询某一次故障注入的执行状态

``` shell
./blade status 726c10d2bbffdbf7


{
        "code": 200,
        "success": true,
        "result": {
                "Uid": "726c10d2bbffdbf7",
                "Command": "cpu",
                "SubCommand": "fullload",
                "Flag": " --cpu-count=2",
                "Status": "Success",
                "Error": "",
                "CreateTime": "2023-02-18T13:07:18.801277194+08:00",
                "UpdateTime": "2023-02-18T13:07:19.921206569+08:00"
        }
}
```

也可以查询某中类型指令的故障执行状态

``` shell
./blade status --type create
```

指令的执行结果状态一共分为如下几种：

1.  Created：故障注入

2.  Success：故障注入命令执行成功

3.  Running：给 Java 和 C++故障场景使用的，当 java agent 挂载成功后，状态变为 Running。

4.  Error：故障注入命令执行失败

5.  Destroyed：销毁故障

6.  Revoked：撤销 Java 和 C++故障注入的前置工作，例如将 Java agent 卸载。


# ChaosBlade Cli 源码分析

## 初始化数据库

Chaosblade 使用SQLite记录执行故障模型数据，例如状态，错误信息等。在执行销毁和查询状态等命令时可以从SQLite中直接获取已存储的数据。（SQLite是一个进程内的库，实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库。）

``` go
func (s *Source) init() {
   s.CheckAndInitExperimentTable()
   s.CheckAndInitPreTable()
}


func getConnection() *sql.DB {
   database, err := sql.Open("sqlite3", path.Join(util.GetProgramPath(), dataFile))
   if err != nil {
      log.Fatalf(context.Background(), "open data file err, %s", err.Error())
      //log.Error(err, "open data file err")
      //os.Exit(1)
   }
   return database
}
```

## 指令生成

在CLi项目启动时，会利用开源项目[Cobra](https://github.com/spf13/cobra)(Cobra是一个用于创建强大的现代CLI应用程序的库)将项目中的yaml文件夹下的各个执行器中spec.yaml转换成Cobra Cli指令。

关键代码如下：

启动时运行CmdInit()构建CLi动作指令，例如Create Command

``` go
func CmdInit() *baseCommand {
   cli := NewCli()
   baseCmd := &baseCommand{
      command: cli.rootCmd,
   }
   // 省略......
   // add revoke command
   baseCmd.AddCommand(&RevokeCommand{})
   // add create command
   createCommand := &CreateCommand{}
   baseCmd.AddCommand(createCommand)
   // 省略......
   return baseCmd
}
```

然后对Create指令添加Sub Command，主要就是添加各个故障场景的Command, 例如基础资源中的cpu、mem，Java中的dubbo、jvm，K8S等等

``` go
func newBaseExpCommandService(actionService actionCommandService) *baseExpCommandService {
   service := &baseExpCommandService{
      commands:           make(map[string]*modelCommand, 0),
      executors:          make(map[string]spec.Executor, 0),
      bindFlagsFunc:      actionService.bindFlagsFunction(),
      actionRunEFunc:     actionService.actionRunEFunc,
      actionPostRunEFunc: actionService.actionPostRunEFunc,
   }
   // 注册SubCommands
   service.registerSubCommands()
   for _, command := range service.commands {
      // 添加到Create Command下
      actionService.CobraCmd().AddCommand(command.CobraCmd())
   }
   return service
}
```

以注册OS SubCommands举例子，

1.  首先将会解析os-spec.yaml（文件中是各种基础资源类故障场景的描述文件），

2.  生成指令model，并为每一个基础资源类的故障场景都分配OS执行器客户端。

3.  将指令model转换为Corba Sub Command指令(对指令中添加描述信息，名称，别名，以及设置指令对应的运行函数)


``` go
// registerOsExpCommands
func (ec *baseExpCommandService) registerOsExpCommands() []*modelCommand {
   // 读取当前blade程序同级别yaml目录下的chaosblade-os-spec-%s.yaml文件
   file := path.Join(util.GetYamlHome(), fmt.Sprintf("chaosblade-os-spec-%s.yaml", version.Ver))
   // 转换成指令model，并分配OS执行器客户端
   models, err := specutil.ParseSpecsToModel(file, os.NewExecutor())
   if err != nil {
      return nil
   }
   osCommands := make([]*modelCommand, 0)
   for idx := range models.Models {
      model := &models.Models[idx]
      command := ec.registerExpCommand(model, "")
      osCommands = append(osCommands, command)
   }
   return osCommands
}


// registerActionCommand 对指令中添加描述信息，名称，别名，以及设置指令对应的运行函数
func (ec *baseExpCommandService) registerActionCommand(target, scope string, actionCommandSpec spec.ExpActionCommandSpec) *actionCommand {
   // 省略......
   command.command = &cobra.Command{
      Use:      actionCommandSpec.Name(),
      Aliases:  actionCommandSpec.Aliases(),
      Short:    actionCommandSpec.ShortDesc(),
      Long:     actionCommandSpec.LongDesc(),
      Example:  actionCommandSpec.Example(),
      // 设置指令对应的运行函数actionRunEFunc
      RunE:     ec.actionRunEFunc(target, scope, command, actionCommandSpec),
      PostRunE: ec.actionPostRunEFunc(command),
   }
   // 省略......
  return command
}
```

通过图来看CLI的启动流程比较清晰，感兴趣的同学可以根据图和上面的代码进行源码阅读：

![](/img/2023-08-16-chaosblade-tool/tool-4.png)

## 指令执行

在指令生成时我们已经对Cobar Command设置了对应的运行函数actionRunEFunc(),也就是说当我们在控制台执行blade故障命令后，Cobar会将请求路由到我们指定的actionRunEFunc函数中。

那么在actionRunEFunc都做了哪些事情呢？由于actionRunEFunc中代码比较长，这里就不粘贴了，流程如下：

![](/img/2023-08-16-chaosblade-tool/tool-5.png)

## 执行器

在CLI中支持的执行器客户端类型有多种，执行器则是代表支持哪些种类的故障场景。在文章的开篇已经介绍过了，每个执行器的客户端运行思路基本差不多。例如：

-   OS 执行器客户端是调用ChaosBlade程序中的bin目录下的chaos\_os可执行文件，在chaos\_os可执行文件中会真正的进行基础资源类故障。


``` go
chaosOsBin := path.Join(util.GetProgramPath(), "bin", spec.ChaosOsBin)
command := os_exec.CommandContext(ctx, chaosOsBin, argsArray...)
log.Debugf(ctx, "run command, %s %v", chaosOsBin, argsArray)


```

-   Java 执行器客户端要相对复杂一些，由于java的故障场景底层都是利用JVM-Sandbox开源项目完成的agent挂载和字节码增强，所以需要调用JVM-SandBox接口来完成故障注入/销毁的指令。


``` go
// createUrl中会拼接SandBox的地址和端口
url, body, resp := e.createUrl(ctx, port, model)
if err != nil {
   return resp
}
result, err, code = util.PostCurl(url, body, "")
```

-   K8S 执行器客户端是通过调用K8S接口，对ChaosBlade自定义资源完成的资源变更，然后ChaosBlade Operator利用list/watch机制实现的故障注入/清除


``` go
func create(cli client.Client, chaosblade *v1alpha1.ChaosBlade) (result *v1alpha1.ChaosBlade, err error) {
   err = cli.Create(context.TODO(), chaosblade)
   if err != nil {
      return nil, err
   }
   return get(cli, chaosblade.Name)
}
```

其他故障执行器的客户端实现也基本相同，在这里就不一一赘述了。

# 总结

ChaosBlade Tool是一个的故障注入工具箱，有CLI项目以及多个故障执行器组件构成，它开箱即用，并提供了多种场景的故障注入能力，其中包括基础资源、Java应用、K8S、Docker、CRI、中间件、云平台、C++等。 

ChaosBlade Cli是故障工具箱中的触发者，它提供故障指令的生成,接收用户的command指令，分发指令到不同的执行器中去运行，它的源码相对简单，并不涉及真正的故障注入能力。

# 作者介绍

张斌斌（Github 账号：[binbin0325](https://github.com/binbin0325)，公众号:[柠檬汁Code](https://binbin0325.github.io/)）Sentinel-Golang Committer 、ChaosBlade Committer 、 Nacos PMC 、Apache Dubbo-Go Committer。目前主要关注于混沌工程、中间件以及云原生方向。