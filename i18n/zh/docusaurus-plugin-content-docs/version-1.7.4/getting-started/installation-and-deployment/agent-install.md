---
title: 探针(Agent)安装
sidebar_position: 3
---

探针主要作为平台端建联、命令下发通道和数据收集等功能，所以如果需要对目标集群或主机进行演练，需要在端侧的目标集群或主机上安装探针，以便将平台编排好的演练转化成命令，下发到目标机器上。

在 [安装 Box 平台](./platform-box-install-and-uninstall.md) 后，进入 Box 主页，在左侧导航栏选择**探针管理**，根据端侧环境选择不同的探针安装方式
![image.png](/img/zh/quick-start/agent/agent-manager.png)

## 主机环境下安装

### 自动安装探针

利用自动安装探针，需要在安装 Box 平台时已有[自动安装探针环境准备](./platform-box-install-and-uninstall.md/#第二步确保环境能自动安装探针)，否则无法使用

1. 进入**探针管理**页面后，点选右上角的**自动安装探针**按钮

![image.png](/img/zh/quick-start/agent/agent-auto-install.png)

2. 根据是否已有应用名，选择**已有应用**和**新增应用，**并填写目标主机的**IP 地址**及 SSH 登陆的**用户**和**密码**

![image.png](/img/zh/quick-start/agent/agent-install-app.png)

3. 最后点击安装即可

### 手动安装探针

1. 进入**探针管理**页面后，点选右上角的**手动安装探针**按钮 或 页面中的**接入探针**，进入探针安装指引页面

![image.png](/img/zh/quick-start/agent/agent-install-manual.png)

2. 点击**主机**，进入主机手动安装的命令提示页面

![image.png](/img/zh/quick-start/agent/agent-install-list.png)

3. 复制命令提示页面的命令，并将必要参数进行替换后，在目标主机上执行即可

![image.png](/img/zh/quick-start/agent/agent-install-linux.png)
_参数说明如下：_

| **参数名**     | **备注**                  | **default**             | **示例**      |
| -------------- | ------------------------- | ----------------------- | ------------- |
| p              | 应用名                    | chaos-default-app       | my-test       |
| g              | 应用分组名                | chaos-default-app-group | my-test-group |
| P              | agent 端口号              | 19527                   | 19527         |
| t              | chaosblade-box 的 ip:port |
| 172.0.0.1:7001 |

## Kubernetes 环境下安装

Kubernetes 环境下只提供手动安装方式

1. 进入**探针管理**页面后，点选右上角的**手动安装探针**按钮 或 页面中的**接入探针**，进入探针安装指引页面

![image.png](/img/zh/quick-start/agent/agent-install-manual.png)

2. 点击**自建 Kubernetes**，进入主机手动安装的命令提示页面

![image.png](/img/zh/quick-start/agent/agent-install-list-k8s.png)

3. 根据安装提示页面上的指引，先下载 Chart 包，然后利用 Helm 进行安装

![image.png](/img/zh/quick-start/agent/agent-install-k8s.png)
_参数说明如下：_

| **参数名**              | **备注**                  | **default** | **示例**     |
| ----------------------- | ------------------------- | ----------- | ------------ |
| transport.endpoint      | chaosblade-box 的 ip:port |
| 127.0.0.1:7001          |
| controller.cluster_id   | 安装 k8s 集群的 ID        |             | abcdefg123hi |
| controller.cluster_name | 安装 k8s 集群的 name      |             | test-cluster |

4. 如果需要对该集群进行演练，则需要再安装 chaosblade-operator，具体可参考[chaosblade-operator 安装指引](./tool-chaosblade-install-and-uninstall.md/#kubernetes环境下安装)
