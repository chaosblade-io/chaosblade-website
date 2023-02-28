---
title: blade check
---

本文档主要介绍`blade check`命令使用

## Usage

该命令主要用于**Linux 主机**上演练实验时，对主机环境进行校验，判断其是否满足 chaosblade 实验环境

```shell
Usage:
  blade check
  blade check [command]

Aliases:
  check, k

blade check [target] [action]
```

## Description

该命令目前支持校验， Linux 主机系统层场景和 java 场景 环境所需配置，如相关系统命令工具或 java 不存在时，可在演练执行前进行安装。

## Exec

进入解压包本地所放置的路径，可通过`./blade check -h`查看所有支持的 target，目前支持两种

- OS：验证 Linux 主机系统层场景所需环境是否支持
- Java：验证 Java 应用层场景所需环境是否支持

```
[root@test chaosblade]# ./blade check -h
Check the environment for chaosblade

Usage:
  blade check
  blade check [command]

Aliases:
  check, k

Examples:
check os

Available Commands:
  java        Check the environment of java for chaosblade
  os          Check the environment of os for chaosblade

Flags:
  -h, --help   help for check

Global Flags:
  -d, --debug   Set client to DEBUG mode

Use "blade check [command] --help" for more information about a command.
```

可通过`./blade check os -h`查看主机系统下具体演练实验场景，是否符合可以执行的条件。

```
[root@test chaosblade]# ./blade check os -h
Check the environment of os for chaosblade

Usage:
  blade check os
  blade check os [command]

Examples:
check os

Available Commands:
  cpu         Cpu experiment
  disk        Check disk experiment
  men         Mem experiment
  network     Network experiment

Flags:
  -h, --help   help for os

Global Flags:
  -d, --debug   Set client to DEBUG mode

Use "blade check os [command] --help" for more information about a command.
```

## Examples

校验主机是否具备演练系统层场景`cpu fullload`（cpu 满载）的环境

```
[root@test chaosblade]# ./blade check os cpu fullload
```

校验主机是否具备演练所有系统层场景的环境

```
[root@test chaosblade]# ./blade check os
```

## 报错结果和对应处理方法

<table>
<tr>
<td><b>错误返回中的error信息</b></td>
<td><b>对应解释</b></td>
<td><b>相应处理方法</b></td>
</tr>

<tr>
<td>[failed] cpu fullload, failed! `taskset` command exists </td>
<td> taskset 命令不存在 </td>
<td><ul>
安装taskset，taskset工具在linux是 util-linux 包的一部分:
<li> Debian、Ubuntu 或 Linux Mint </li>
<dl><dd>sudo apt-get install util-linux</dd></dl>
<li> CentOS、Fedora 或 RHEL </li>
<dl><dd>sudo yum install util-linux</dd></dl>
</ul></td>
</tr>

<tr>
<td>[failed] men load, failed! `mount` command exists </td>
<td> mount 命令不存在 </td>
<td><ul>
安装mount，mount工具在linux是 util-linux 包的一部分:
<li> Debian、Ubuntu 或 Linux Mint </li>
<dl><dd>sudo apt-get install util-linux </dd></dl>
<li> CentOS、Fedora 或 RHEL </li>
<dl><dd>sudo yum install util-linux</dd></dl>
</ul></td>
</tr>

<tr>
<td>[failed] men load, failed! `umount` command exists </td>
<td> umount 命令不存在 </td>
<td><ul>
安装umount，umount工具在linux是 util-linux 包的一部分:
<li> Debian、Ubuntu 或 Linux Mint </li>
<dl><dd>sudo apt-get install util-linux </dd></dl>
<li> CentOS、Fedora 或 RHEL </li>
<dl><dd>sudo yum install util-linux</dd></dl>
</ul></td>
</tr>

<tr>
<td>[failed] men load, failed! `tc` command exists </td>
<td> tc 命令不存在 </td>
<td><ul>
安装tc，tc工具是绑定在iproute而来的，所以安装 iproute即可 
<li> Debian、Ubuntu 或 Linux Mint </li>
<dl><dd>sudo apt-get install iproute </dd></dl>
<li> CentOS、Fedora 或 RHEL </li>
<dl><dd>sudo yum install iproute</dd></dl>
</ul></td>
</tr>

<tr>
<td>[failed] ****, failed! `iptables` command exists </td>
<td> iptables 命令不存在 </td>
<td><ul>
安装iptables:
<li> Debian、Ubuntu 或 Linux Mint </li>
<dl><dd>sudo apt-get install iptables </dd></dl>
<li> CentOS、Fedora 或 RHEL </li>
<dl><dd>sudo yum install iptables </dd></dl>
</ul></td>
</tr>

<tr>
<td>[failed] ****, failed! `ss` command exists </td>
<td> ss 命令不存在 </td>
<td><ul>
安装ss，ss工具是绑定在iproute而来的，所以安装iproute即可
<li> Debian、Ubuntu 或 Linux Mint </li>
<dl><dd>sudo apt-get install iproute </dd></dl>
<li> CentOS、Fedora 或 RHEL </li>
<dl><dd>  sudo yum install iproute</dd></dl>
</ul></td>
</tr>

</table>
