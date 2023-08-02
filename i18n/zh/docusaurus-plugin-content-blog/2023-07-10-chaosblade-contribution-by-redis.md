---
title: 由Redis故障场景，说说ChaosBlade贡献的二三事
authors: Yuaninga
tags: [ chaosblade ]
description: 由Redis故障场景贡献示例，介绍ChaosBlade贡献入门。
hide_table_of_contents: false
---

## 概述

本文以2个新增Redis原子事件为例，帮助刚接触ChaosBlade的社区同学快速入门开源贡献。

开源贡献前提：了解混沌工程和掌握Golang开发。

#### 原子事件贡献流程图如下：

![contribution_process.png](/img/2023-07-10-chaosblade-contribution-by-redis/contribution_process.png)



<!--truncate-->
## 第一步：分析故障演练需求，确认新增原子事件

Redis实际使用过程中会存在故障演练需求。

例如：
- 模拟Key过期故障：可以触发所有key过期的极端故障场景。
- 模拟缓存内存限制故障：可以主动触发Redis 内存淘汰策略释放内存场景。

根据故障演练需求价值，决定是否有必要新增相关混沌工程原子事件。



## 第二步：Fork项目&本地拉取代码并创建dev分支

![fork_and_branch.png](/img/2023-07-10-chaosblade-contribution-by-redis/fork_and_branch.png)



## 第三步：正式开始新原子事件开发

### 3.1 拉取chaosblade-exec-middleware项目代码

middleware项目：包含Nginx、Redis等中间件相关实验核心代码。

项目地址：https://github.com/chaosblade-io/chaosblade-exec-middleware

### 3.2 新建redis目录

该目录放置Redis原子事件核心代码
```shell
mkdir chaosblade-exec-middleware/exec/redis
```

### 3.3 新建 redis.go 文件

```go
package redis

import (
	"github.com/chaosblade-io/chaosblade-spec-go/spec"
)

type RedisCommandSpec struct {
	spec.BaseExpModelCommandSpec
}

func (*RedisCommandSpec) Name() string {
	return "redis"
}

func (*RedisCommandSpec) ShortDesc() string {
	return "Redis experiment"
}

func (*RedisCommandSpec) LongDesc() string {
	return "Redis experiment"
}

func NewRedisCommandSpec() spec.ExpModelCommandSpec {
	return &RedisCommandSpec{
		spec.BaseExpModelCommandSpec{
			ExpActions: []spec.ExpActionCommandSpec{
				NewCacheExpireActionSpec(),
				NewCacheLimitActionSpec(),
			},
			ExpFlags: []spec.ExpFlagSpec{},
		},
	}
}
```


### 3.4 Redis原子事件包含到Model
model目录位置：chaosblade-exec-middleware/exec/model/目录

model目录不同文件对应不同系统支持：
- model_darwin.go 支持Mac系统
- model_linux.go 支持linux系统
- model_windows.go 支持windows系统

model具体代码：

[chaosblade-exec-middleware/exec/model/](https://github.com/chaosblade-io/chaosblade-exec-middleware/tree/main/exec/model)

```go

package model

import (
	"github.com/chaosblade-io/chaosblade-exec-middleware/exec/nginx"
	"github.com/chaosblade-io/chaosblade-exec-middleware/exec/redis"
	"github.com/chaosblade-io/chaosblade-spec-go/spec"
)

// GetAllExpModels returns the experiment model specs in the project.
// Support for other project about chaosblade
func GetAllExpModels() []spec.ExpModelCommandSpec {
	return []spec.ExpModelCommandSpec{
		nginx.NewNginxCommandSpec(),
		redis.NewRedisCommandSpec(),
	}

```

### 3.5 Redis原子事件包含到编译文件

具体文件：添加Redis到chaosblade-exec-middleware/build/spec.go

具体代码：

[chaosblade-exec-middleware/build/spec.go](https://github.com/chaosblade-io/chaosblade-exec-middleware/blob/main/build/spec.go)

```go
...
// getModels returns experiment models in the project
func getModels() *spec.Models {
	modelCommandSpecs := []spec.ExpModelCommandSpec{
		nginx.NewNginxCommandSpec(),
		redis.NewRedisCommandSpec(), // <== Redis相关 
	}
	specModels := make([]*spec.Models, 0)
	for _, modeSpec := range modelCommandSpecs {
		flagSpecs := append(modeSpec.Flags(), model.GetSSHExpFlags()...)
		modeSpec.SetFlags(flagSpecs)
		specModel := util.ConvertSpecToModels(modeSpec, spec.ExpPrepareModel{}, "host")
		specModels = append(specModels, specModel)
	}
	return util.MergeModels(specModels...)
}
...

```

### 3.6 开发具体原子事件
1. 缓存过期实验：

[chaosblade-exec-middleware/exec/redis/redis_cache_expire.go](https://github.com/chaosblade-io/chaosblade-exec-middleware/blob/main/exec/redis/redis_cache_expire.go)

2. 缓存内存限制实验

[chaosblade-exec-middleware/exec/redis/redis_cache_limit.go](https://github.com/chaosblade-io/chaosblade-exec-middleware/blob/main/exec/redis/redis_cache_limit.go)



## 第四步：使用Goland本地调试，有bug或优化再次开发调试。

### 4.1 搭建准备Redis服务
参考相关文档

### 4.2 修改Goland Debug配置
#### 1.打开main.go 点击三角按钮，选择Modify Run  Configuration...

![debug_01.png](/img/2023-07-10-chaosblade-contribution-by-redis/debug_01.png)

#### 2.修改debug配置：详细使用可以查看Goland官方文档

![debug_02.png](/img/2023-07-10-chaosblade-contribution-by-redis/debug_02.png)

#### 3.执行Debug操作：详细使用可以查看Goland官方文档

![debug_03.png](/img/2023-07-10-chaosblade-contribution-by-redis/debug_03.png)



## 第五步：本地编译并替换测试环境旧编译文件

### 5.1 参考官方文档执行编译
#### 如果在 mac 系统上，编译当前系统的版本，请执行：
`make build_darwin`

#### 如果想在 mac 系统上，编译 linux 系统x86架构版本，请执行：
`make build_linux`

#### 如果想在 mac 系统上，编译linux 系统arm 架构版本，请执行：
`make build_linux_arm`

说明：其他系统编译说明参考 [官方文档](https://github.com/chaosblade-io/chaosblade/blob/master/README_CN.md)

### 5.2 编译后文件存放在target目录中

![build_01.png](/img/2023-07-10-chaosblade-contribution-by-redis/build_01.png)

### 5.3 测试环境替换为新编译文件
将测试服务器chaosblade目录以下文件替换为新版本
- chaosblade-1.7.2/bin/chaos_middleware
- chaosblade-1.7.2/yaml/chaosblade-middleware-spec-1.7.2.yaml


![build_02.png](/img/2023-07-10-chaosblade-contribution-by-redis/build_02.png)


## 第六步：测试环境测试直至通过

### 6.1 测试模拟缓存过期实验

#### 执行实验：
```shell
#示例1：expire a key
blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --key test1 --expiry 1m
#示例2：expire all keys only when the new expiry is greater than current one
blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --option GT --expiry 1m
```
#### 验证实验结果：
```shell
# 实验前
192.168.56.101:6379> set  test1 test2
OK
192.168.56.101:6379> get test1
"test2"
192.168.56.101:6379> expire test1 3000
(integer) 1
192.168.56.101:6379> ttl test1
(integer) 2924
# 实验后
# blade create redis cache-expire --addr 192.168.56.101:6379 --password 123456 --option GT --expiry 1m
192.168.56.101:6379> ttl test1
(integer) 58
```

### 6.2 测试模拟缓存内存限制实验
#### 执行实验：
```shell
# 示例： set maxmemory to 256M
blade create redis cache-limit --addr 192.168.56.101:6379 --password 123456  --size 256M
```
#### 验证实验结果：
```shell
# 实验前
192.168.56.101:6379> config get maxmemory
1) "maxmemory"
2) "0"
# 实验后
# blade create redis cache-limit --addr 192.168.56.101:6379 --password 123456  --size 256M
192.168.56.101:6379> config get maxmemory
1) "maxmemory"
2) "256000000"
```
说明：测试有bug或待优化，重复开发、调试和编译步骤



## 第七步：使用dev分支创建和提交PR

### 7.1 推送本地dev分支GitHub远程
```shell
# commit
git commit -s  -m "add 2 redis experiments"
# push
git push origin dev
```

### 7.2 登录GitHub 使用dev分支创建和提交PR

![pr_01.png](/img/2023-07-10-chaosblade-contribution-by-redis/pr_01.png)


### 7.3 提交PR后准备官网ChaosBlade文档贡献



## 第八步：PR审查直至审查通过

![pr_02.png](/img/2023-07-10-chaosblade-contribution-by-redis/pr_02.png)



## 第九步：PR合并至main，新增原子事件贡献成功。

![pr_03.png](/img/2023-07-10-chaosblade-contribution-by-redis/pr_03.png)




>
> ChaosBlade 官方网址：[https://chaosblade.io/](https://chaosblade.io/)
>
> ChaosBlade Github : [https://github.com/chaosblade-io/chaosblade](https://github.com/chaosblade-io/chaosblade)
>
> ChaosBlade 钉钉社区交流群:23177705

