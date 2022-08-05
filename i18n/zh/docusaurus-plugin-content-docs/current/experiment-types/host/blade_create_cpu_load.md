---
id: blade create cpu load 
---

# 模拟CPU负载实验
本文档介绍如何在物理主机下使用 ChaosBlade 模拟 CPU 负载压力实验，可通过参数指定 CPU 负载百分比、负载核（数）等数据。

## 场景介绍
CPU 混沌实验用于在主机模拟 CPU 负载情况，通过抢占CPU资源，模拟 CPU 在特定负载情况下，验证其对服务质量、监控告警、流量调度、弹性伸缩等应用能力的影响。

CPU 相关的混沌实验包含 CPU 满载，可以指定核数、具体核满载或者总 CPU 负载百分比。

运行以下命令可查看模拟 CPU 负载场景的帮助信息：
```
blade create cpu fullload -h
```


## 参数
|  参数名 |  说明 | 类型 | 值 |
|  ----  | ---- | ---- | ---- |
| `cpu-count` | 指定 CPU 负载的核数 | int | 仅当`cpu-list`为空时有效，取值范围为 0-cpu逻辑核数，默认取值cpu逻辑核数 |
| `cpu-list` | 指定 CPU 负载的具体核，核索引从0开始 | string | 0-3 或 0,3
| `cpu-percent` | 指定 CPU 负载百分比 | int | 取值范围为`0-100`，默认为`100` | 
| `climb-time` | 指定 CPU 负载爬坡时间，单位秒 | int | 取值范围为`0-600`，默认为`0` |



## 示例
### 创建 CPU 满载实验
```
blade create cpu fullload
```
输出如下所示代表实验执行成功，result返回值表示实验的uid，在销毁实验中需要使用
```
{"code":200,"success":true,"result":"3383caddcd7c43f7"}
```
可通过top 1指令查看执行情况
```
%Cpu0  : 99.3 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.7 hi,  0.0 si,  0.0 st
%Cpu1  : 99.3 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.3 hi,  0.3 si,  0.0 st
%Cpu2  : 99.0 us,  0.7 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.3 hi,  0.0 si,  0.0 st
%Cpu3  : 97.3 us,  2.3 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.3 hi,  0.0 si,  0.0 st
```
实验生效，接下来销毁实验
```
blade destroy 3383caddcd7c43f7
```
若返回code为200则销毁成功

### 随机指定核数满载

```
blade create cpu fullload --cpu-count 2
```

使用top 1指令验证
```
%Cpu0  : 99.3 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.3 hi,  0.3 si,  0.0 st
%Cpu1  :  0.7 us,  1.7 sy,  0.0 ni, 13.3 id, 83.3 wa,  0.7 hi,  0.3 si,  0.0 st
%Cpu2  : 99.3 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.7 hi,  0.0 si,  0.0 st
%Cpu3  :  1.3 us,  2.3 sy,  0.0 ni,  0.0 id, 95.0 wa,  1.0 hi,  0.3 si,  0.0 st
```

指令生效，Cpu0 和 Cpu2 满载

### 指定具体索引核满载

```
blade create cpu fullload --cpu-list 0,3
```

使用 top 1 指令验证

```
%Cpu0  : 99.3 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.7 hi,  0.0 si,  0.0 st
%Cpu1  :  0.3 us,  2.3 sy,  0.0 ni, 11.4 id, 84.9 wa,  0.7 hi,  0.3 si,  0.0 st
%Cpu2  :  0.7 us,  2.0 sy,  0.0 ni,  0.0 id, 96.3 wa,  1.0 hi,  0.0 si,  0.0 st
%Cpu3  : 92.3 us,  0.0 sy,  0.0 ni,  7.0 id,  0.0 wa,  0.3 hi,  0.3 si,  0.0 st
```

指令生效，Cpu0 和 Cpu3 满载


### 指定 CPU 负载百分比
```
blade create cpu fullload --percent 50
```

使用 top 指令验证

```
%Cpu(s): 40.3 us,  1.3 sy,  0.0 ni, 58.1 id,  0.0 wa,  0.3 hi,  0.0 si,  0.0 st
```

## 实现原理
利用消耗CPU时间片来做。详见代码：[burncpu](https://github.com/chaosblade-io/chaosblade-exec-os/blob/master/exec/bin/burncpu/burncpu.go)
