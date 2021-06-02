---
title: Chaosblade-Box 用户手册
author: 叶飞
author_title: ChaosBlade PMC
author_url: https://github.com/tiny-x
author_image_url: https://avatars.githubusercontent.com/u/29175949?v=4
tags: [ chaosblade ]
description: Chaosblade-Box 用户手册
hide_table_of_contents: false
---


Chaosblade-box是一个具有丰富场景的混沌工程平台，按照场景规范可以接入 litmuschaos、chaosmesh 等演练工具，整体设计如图：

![img](https://cdn.nlark.com/yuque/0/2021/png/240190/1620874200545-b630c68e-3050-4db8-ad64-54e62d431b02.png)

## 1 部署

### 1.1 下载



目前最新版本 0.4.1



```
wget https://chaosblade.oss-cn-hangzhou.aliyuncs.com/platform/release/0.4.1/chaosblade-box-web-0.4.1.jar
```



### 1.2 安装数据库 Mysql

#### 1.2.1 Docker 运行 mysql

已经有数据库的用户可以跳过此步骤。



```
docker run --rm -d -it \
  -p 3307:3306 \
  -e MYSQL_DATABASE=chaosblade \
  -e MYSQL_ROOT_PASSWORD=123456 \
  --name chaos-mysql mysql:5.6 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci \
  --default-time_zone='+8:00'
```



#### 1.2.2 创建数据库

- 使用 docker 运行的数据库，按照如下命令创建数据库即可，**执行命令时注意更改下容器名称**



```
docker exec -i chaos-mysql mysql -uroot -proot -e 'CREATE DATABASE IF NOT EXISTS chaosblade'
```



### 1.3 启动平台



1.3.1 启动时参数：

- --spring.datasource.url: 数据库地址
- --spring.datasource.username: 用户名

- --spring.datasource.password：密码



```
nohup java -Duser.timezone=Asia/Shanghai -jar chaosblade-box-web-0.4.1.jar --spring.datasource.url="jdbc:mysql://127.0.0.1:3306/chaosblade?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai" --spring.datasource.username=root --spring.datasource.password=123456 > chaosblade-box.log 2>&1 &
```



### 1.4 访问平台



检查启动日志，未出现异常的情况下，可以浏览器访问 http://127.0.0.1:8080/  打开 Chaosblade-Box



## 2 快速入门



### 2.1 安装探针-主机



为了快速入门，选择 SSH 方式安装探针，点击菜单 探针管理 -> 安装探针，选择 SSH 方式安装探针



必填参数：



-  IP 
-  端口 

-  用户名 
-  密码 



**内网用户，可以选择手动安装**



![img](https://cdn.nlark.com/yuque/0/2021/png/240190/1620806389217-24248f8f-e019-49cf-a8f1-8083eaaff4d1.png)

### 2.1 安装探针-Kubernetes



Kubernetes  目前是归属在探针安装菜单下面，但是值得一提得它并不是探针，只是注册一个 Kubernetes 集群，需要输入集群名称和 Kubeconfig 。



点击菜单 探针管理 -> 安装探针，选择 Kubernetes ，输入机器名称和 Kubeconfig ，开启采集即可（开启采集后，节点、Pod、容器等可能会过 30 秒到 1 分钟的样子被采集到）

### 2.1 演练工具

#### 2.1.1 主机



如果是手动安装探针的，需要手动安装演练工具，登录需要执行演练的机器（需要外网，内网用户请下载 `wget` 命令后的文件到内网环境，更改命令后再执行），执行如下命令:



```
## 手动安装工具
wget https://chaosblade.oss-cn-hangzhou.aliyuncs.com/platform/chaostoolsctl.sh -O chaostoolsctl.sh && chmod +x chaostoolsctl.sh && ./chaostoolsctl.sh install -n chaosblade -v 1.0.0  -r https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/github/1.0.0/chaosblade-1.0.0-linux-amd64.tar.gz
```



#### 2.1.1 Kubernetes



暂时需要手动安装 chaosblade-operator，参考 https://github.com/chaosblade-io/chaosblade-operator/releases

### 2.3 创建演练



探针安装完成功后，会显示在线状态，可以在机器列表看到机器情况，也可以在创建演练页面选择对应的机器，点击菜单 实验管理 -> 创建演练



必填参数



-  演练名称 
-  演练维度（默认主机） 

-  机器选择 
-  演练内容



输入必填参数，点击提交，自动跳转到演练详情页面



![img](https://cdn.nlark.com/yuque/0/2021/png/240190/1620806406807-2869a8c6-5f13-45af-b7b7-836a0d2c6c89.png)

监控内容作为可选，点击添加监控如下图，box 内置了一些 promsql 的表达式，用户添加下 prometheus 的 api 地址即可，例如 /api/v1/query/ ap i/query /api/v1/query

![img](https://cdn.nlark.com/yuque/0/2021/png/240190/1621992765801-15ce7498-5d09-404a-8349-912ba612cf9f.png)

### 2.4 执行演练



创建演练完成后，自动跳转到演练详情页面，点击执行演练跳转到任务详情页



![img](https://cdn.nlark.com/yuque/0/2021/png/240190/1620806420190-58fcfd12-346c-41cd-942d-1215442b03fb.png)



### 2.5 终止演练



点击终止演练案件，终止成功后可点击重新执行



![img](https://cdn.nlark.com/yuque/0/2021/png/240190/1620806441294-7c3798b8-4e97-49f1-baaf-8d429e9da2be.png)



## 3 功能菜单



### 3.1 机器列表



在机器列表包含了 box 能演练的所有机器，分为：



-  主机 
-  Node 

-  Pod 



主机是需要安装探针的，在快速入门里面介绍 SSH 方式安装探针，还支持 Ansbile 和手动安装。



- Ansbile：需要在 box 所在机器安装 ansbile
- 手动安装：手动登录到需要演练的机器上面，在 box 安装探针页面选择手动安装复制命令，更新 box 所在 IP 和启动端口，手动执行即可



机器列表还可以禁用机器来达到禁止演练的目的



### 3.2 实验管理



#### 3.2.3 创建演练



- 演练名称：必填
- 演练维度：必填，主机、Node、Pod、Container

- 演练内容：必填，选择一个演练场景、填充场景所需的参数
- 监控：选填，目前支持接入 prometheus，集成一些默认的 promsql，用户输入下 prometheus api 地址即可。



### 3.4 场景管理



#### 3.4.1 场景目录



仅仅是场景的分类



#### 3.4.2 场景列表



场景列表包含 box 所能演练的所有场景，也可以选择导入场景来导入一些自定义场景（需要符合 ChaosBalde 场景模型）。



- 下架：下架场景后，在创建演练页不能被选择此场景。
- 详情：场景的详情页，可以编译场景的所属类目，场景的参数等。



### 3.5 探针管理



#### 3.5.1 探针列表



探针列表包含了所以安装探针的主机，可以选择禁用探针，来禁止主机创建演练、心跳等。



#### 3.5.2 探针安装



探针安装目前包含 Ansbile 、手动安装、SSH ，内网环境默认情况下只支持手动安装



-  Ansbile：需要在 box 所在机器安装 ansbile 
-  手动安装：手动登录到需要演练的机器上面，在 box 安装探针页面选择手动安装复制命令，更新 box 所在 IP 和启动端口，手动执行即可 

-  SSH：输入 IP 、端口、用户名、密码即可安装 



#### 3.5.3 Kubernetes



Kubernetes  目前是归属在探针安装菜单下面，但是值得一提得它并不是探针，只是注册一个 Kubernetes 集群，需要输入集群名称和 Kubeconfig 。



- 添加集群：需要输入集群名称和 Kubeconfig，点击添加后会校验 Kubeconfig 有效性，不能访问到的集群是不允许被添加的
- 编辑：修改集群名称和 Kubeconfig

- 详情：查看集群名称和 Kubeconfig
- 开启采集：**集群需要演练的前提是必须开启**。

- 关闭采集：因为采集会消耗 box 一定的资源，所有才放开了关闭采集的按钮。



### 3.6 工具市场



工具市场包含 box 目前所支持的演练工具，功能按钮包含：



-  场景管理 
-  工具管理 



#### 3.6.1 场景管理



暂时没什么用，场景会在 box 启动时自动导入的。



#### 3.6.2 工具管理



工具管理分为主机工具和 Kubernetes 集群



- 主机工具：主机工具会在主机安装探针时，自动安装。
- 集群：集群工具由 helm 来管理的仓库工具，必须指定私有仓库，才可以在 box 上面安装，也可以手动安装。
