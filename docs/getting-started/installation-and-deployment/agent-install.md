---
title: Agent Install
sidebar_position: 3
---

The probe functions as a platform connection, command delivery channel, and data collection. Therefore, if you need to experiment the target cluster or host, install the probe on the target cluster or host so that the expriment can be converted into commands and delivered to the target host.

At [install Box platform](./platform-box-install-and-uninstall.md) then ，enter Box main page，In the left navigation bar, select **Probe Management**，Select different probe installation methods based on the end-side environment
![image.png](/img/zh/quick-start/agent/agent-manager.png)
## Install on a host
### Automatic probe installation
Take advantage of the automatic installation probes, which need to be available when the Box platform is installed [Environment preparation for automatic probe installation](./platform-box-install-and-uninstall.md/#Step 2 Ensure that the environment can automatically install the probe)，Otherwise, it cannot be used.

1. Enter **Probe Management** page，then click on the top right corner **Automatic probe installation** button

![image.png](/img/zh/quick-start/agent/agent-auto-install.png)

2. Depending on whether the application name exists，select **Existing Applications** and **Adding an Application，**And fill in the target host **IP address** And SSH login **username** and **password**

![image.png](/img/zh/quick-start/agent/agent-install-app.png)

3. Finally, click Install
### Manually install the probe

1. Enter **Probe Management** page ，then click to the top right **Manually install the probe** buttoon or  on the page **Access probe** ，The probe installation guide page is displayed,

![image.png](/img/zh/quick-start/agent/agent-install-manual.png)

2. Click **host** ，The command prompt page for manual host installation is displayed

![image.png](/img/zh/quick-start/agent/agent-install-list.png)

3. Copy the commands on the command prompt page, replace the required parameters, and run the commands on the target host

![image.png](/img/zh/quick-start/agent/agent-install-linux.png)
_The parameters are described as follows:_

| **Parameter Name** | **note**       | **default** | **example**   |
| --- |----------------| --- |---------------|
| p | app-name       | chaos-default-app | my-test       |
| g | app-group-name | chaos-default-app-group | my-test-group |
| P | agent-port     | 19527 | 19527         |
| t | chaosblade-box的ip:port | 
 | 172.0.0.1:7001 |

## Kubernetes environment installation
In the Kubernetes environment, only manual installation is available

1. Enter**Probe Management**After the page, click on the top right corner**Manually install the probe**button or on the page **Access probe**，The probe installation guide page is displayed

![image.png](/img/zh/quick-start/agent/agent-install-manual.png)

2. Click **build Kubernetes**，The command prompt page for manual host installation is displayed

![image.png](/img/zh/quick-start/agent/agent-install-list-k8s.png)

3. Follow the instructions on the installation tips page to download the Chart package first, and then install with Helm

![image.png](/img/zh/quick-start/agent/agent-install-k8s.png)
_The parameters are described as follows:_

| **paramas**             | **note**                         | **default** | **example**  |
|-------------------------|----------------------------------| --- |--------------|
| transport.endpoint      | chaosblade-box的ip:port           | 
 | 127.0.0.1:7001          |
| controller.cluster_id   | the Installed k8s cluster's ID   |  | abcdefg123hi |
| controller.cluster_name | the Installed k8s cluster's name |  | test-cluster |

4. If you need to experiment the cluster, install chaosblade-operator. For details, see ChaosBlade-Operator[chaosblade-operator Installation Guide](./tool-chaosblade-install-and-uninstall.md/# Installation kubernetes Environment)
