---
title: 混沌工程平台 Box 安装与卸载
sidebar_position: 1
---

本篇文档主要描述如何安装混沌工程平台 ChaosBlade-Box。

## 主机环境下安装

### 环境准备

#### 第一步，确保环境中已经安装 [Java](https://www.oracle.com/java/technologies/downloads/)

如要查看 Helm 是否已经安装，请执行如下命令：

```shell
java -verison
```

以下是预期输出：

```shell
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
```

#### 第二步，确保环境能自动安装探针

以下环境保障，**主要用于平台自动安装探针时需要用到，如果不需要此功能，可不用安装**

1. 确保环境中安装了`ansible`

```shell
# Check if there is already installed
ansible --version

# install ansible, eg: Fedora || RedHat
yum install ansible -y
```

2. 确保环境中安装了`expect`，将 [sshKey.sh](https://github.com/chaosblade-io/chaosblade-box/blob/main/ssh/sshKey.sh) 和 chaosblade-box-version.jar 放在同一个目录中

```shell
# Check if there is already installed
expect -v

# install expect, eg: Fedora || RedHat
yum install expect -y
```

3. 生成 public key

```shell
# Check if there is already a key, if there is, delete the previous backup
ls ~/.ssh
rm -rf ~/.ssh/*

# generate public key
ssh-keygen -t rsa
```

### 运行应用

如果已经安装过了`MYSQL`，需要创建`chaosblade`的 database，如果没有安装，可以通过`Docker`进行安装运行

```shell
docker run -d -it -p 3306:3306 \
            -e MYSQL_DATABASE=chaosblade \
            -e MYSQL_ROOT_PASSWORD=DATASOURCE_PASSWORD \
            --name mysql-5.6 mysql:5.6 \
            --character-set-server=utf8mb4 \
            --collation-server=utf8mb4_unicode_ci \
            --default-time_zone='+8:00' \
            --lower_case_table_names=1
```

> Notes: 需要将 DATASOURCE_PASSWORD 替换成自定义的密码

可通过以下命令，启动 Box

```shell
nohup java -Duser.timezone=Asia/Shanghai -jar chaosblade-box-1.0.0.jar --spring.datasource.url="jdbc:mysql://DATASOURCE_HOST:3306/chaosblade?characterEncoding=utf8&useSSL=false" --spring.datasource.username=DATASOURCE_USERNAME --spring.datasource.password=DATASOURCE_PASSWORD --chaos.server.domain=BOX-HOST> chaosblade-box.log 2>&1 &
```

> Notes: 需要替换参数 DATASOURCE_HOST、DATASOURCE_USERNAME、DATASOURCE_PASSWORD

### 验证安装

可直接查看进程是否存在，并通过 [http://127.0.0.1:7001](http://127.0.0.1:7001/) 去访问平台

```shell
ps -ef | grep chaosblade-box
```

### 卸载 ChaosBlade-Box

如果需要卸载 ChaosBlade-Box

```shell
# 1. 先查看box进程pid
ps -ef | grep chaosblade-box

# 2. 直接杀掉对应的进程
kill process-pid
```

## Kubernetes 环境下安装

### 环境准备

具体环境准备参见：[Kubernetes 下安装环境准备](./environment-prepare.md/#kubernetes下安装环境准备)

### 使用 Helm 安装

#### 第一步，下载 Box Chart 包

查看所有可以下载的 [box-release](https://github.com/chaosblade-io/chaosblade-box/releases)，下载到本地，如：

```shell
wget https://github.com/chaosblade-io/chaosblade-box/releases/download/v1.0.2/chaosblade-box-1.0.2.tgz
```

#### 第二步，进行安装

```shell
helm install chaosblade-box chaosblade-box-1.0.0.tgz --namespace chaosblade --set spring.datasource.password=DATASOURCE_PASSWORD
```

### 验证安装

要查看 Box 运行情况，请执行以下命令：

```shell
kubectl get po -n chaosblade
```

以下是预期输出

```shell
NAME                                    READY   STATUS    RESTARTS   AGE
chaosblade-box-5bc47b676f-2gjh9         1/1     Running   0          15d
chaosblade-box-mysql-58cc864896-2jxrs   1/1     Running   0          15d
```

如果你的实际输出与预期输出相符，表示 ChaosBlade-Box 已经安装成功。

> ⚠️ 注意
> 如果实际输出的`STATUS` 状态不是 `Running`，则需要运行以下命令查看 Pod 的详细信息，然后依据错误提示排查并解决问题。

```shell
# 以chaosblade-box为例
kubectl describe po chaosblade-box-5bc47b676f-2gjh9 -n chaosblade
```

### 卸载 ChaosBlade-Box

如果需要卸载 ChaosBlade-Box，请执行以下命令：

```shell
helm un chaosblade-box -n chaosblade
```
