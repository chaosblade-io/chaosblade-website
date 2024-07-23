---
title: ChaosBlade工具使用快速入门
---

本文档介绍如何直接通过端侧工具ChaosBlade运行混沌工程实验
## 简介
混沌工程实验除了可以通过可视化界面，直接进行编排和注入，ChaosBlade混沌工程端侧工具本身也可直接执行，其本身支持以下多种方式运行：

- Cli命令行模式：直接通过命令行方式执行演练，可直接执行主机环境和Kubernetes环境下运行
- Yaml文件模式：该方式只对Kubernetes集群进行演练时使用，使用yaml配置文件创建演练 通过定义chaosblade crd资源的方式
- Server模式：即利用./blade server start 将ChaosBlade工具作为一个server启动，然后再通过http远程调用的方式下发命令
## 实验准备
### 第一步，工具包下载
下载二进制工具包 [chaosblade-1.7.0-linux-amd64.tar.gz](https://github.com/chaosblade-io/chaosblade/releases/download/v1.7.0/chaosblade-1.7.0-linux-amd64.tar.gz) 
```shell
wget https://github.com/chaosblade-io/chaosblade/releases/download/v1.7.0/chaosblade-1.7.0-linux-amd64.tar.gz

```
### 第二步，工具解压
```shell
tar -xvf chaosblade-1.7.0-linux-amd64.tar.gz -C /opt/
ln -s /opt/chaosblade-1.7.0 /opt/chaosblade
```
## 准备验证
进入解压包本地所放置的路径，通过`./blade version`或`./blade v`来查看是否可用，预期结果如下：
```
[root@test chaosblade]# cd /opt/chaosblade
[root@test chaosblade]# ./blade version
version: 1.7.0
env: #1 SMP Tue May 26 11:42:35 UTC 2020 x86_64
build-time: Thu Oct 20 02:18:52 UTC 2022
```

