---
title: Platform Box Install And Uninstall
sidebar_position: 1
---

This document describes how to install the Chaos Engineering Platform：ChaosBlade-Box.
## Install on a host
### Environment Preparation
#### First, ensure that the environment is installed [Java](https://www.oracle.com/java/technologies/downloads/)
To see if the Helm is installed, run the following command:
```shell
java -verison
```
Here is the expected output:
```shell
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
```
#### Second, ensure that the environment can automatically install the probe：
The following environmental safeguards，**This function is mainly used when the probe is automatically installed on the platform. If this function is not required, you do not need to install it**

1. Make sure the environment is installed `ansible`
```shell
# Check if there is already installed
ansible --version

# install ansible, eg: Fedora || RedHat 
yum install ansible -y
```

2. Make sure the environment is installed `expect`，let [sshKey.sh](https://github.com/chaosblade-io/chaosblade-box/blob/main/ssh/sshKey.sh) and chaosblade-box-version.jar in the same directory
```shell
# Check if there is already installed
expect -v

# install expect, eg: Fedora || RedHat 
yum install expect -y
```

3. generate public key
```shell
# Check if there is already a key, if there is, delete the previous backup
ls ~/.ssh
rm -rf ~/.ssh/*

# generate public key
ssh-keygen -t rsa
```
### Running the Application
If it's already installed `MYSQL`，You need to create `chaosblade`s database，If not installed, you can pass `Docker` install and run
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
> Notes:  You need to replace **DATASOURCE_PASSWORD** with a custom password

You can run the following command to start the Box
```shell
nohup java -Duser.timezone=Asia/Shanghai -jar chaosblade-box-1.0.0.jar --spring.datasource.url="jdbc:mysql://DATASOURCE_HOST:3306/chaosblade?characterEncoding=utf8&useSSL=false" --spring.datasource.username=DATASOURCE_USERNAME --spring.datasource.password=DATASOURCE_PASSWORD --chaos.server.domain=BOX-HOST> chaosblade-box.log 2>&1 &
```
> Notes: Need to replace parameter DATASOURCE_HOST、DATASOURCE_USERNAME、DATASOURCE_PASSWORD


### Verify installation
You can check whether the process exists and pass the command [http://127.0.0.1:7001](http://127.0.0.1:7001/) Go to the platform
```shell
ps -ef | grep chaosblade-box
```
### Uninstall ChaosBlade-Box
If you need to uninstall **ChaosBlade-Box**
```shell
# 1. Check the box process pid first
ps -ef | grep chaosblade-box

# 2. Directly kill the corresponding process
kill process-pid
```
## Installation in  Kubernetes Environment
### Environment Preparation
For details, see：[Prepare the installation Kubernetes environment](./environment-prepare.md/#Prepare the installation Kubernetes environment)
### Install with Helm
#### First, download the Box Chart package
See all available for download  [box-release](https://github.com/chaosblade-io/chaosblade-box/releases)，Download to local, such as:
```shell
wget https://github.com/chaosblade-io/chaosblade-box/releases/download/v1.0.2/chaosblade-box-1.0.2.tgz
```
#### Second , installation
```shell
helm install chaosblade-box chaosblade-box-1.0.0.tgz --namespace chaosblade --set spring.datasource.password=DATASOURCE_PASSWORD
```
### Verify installation
To see how the Box is running, run the following command：
```shell
kubectl get po -n chaosblade
```
Here is the expected output:
```shell
NAME                                    READY   STATUS    RESTARTS   AGE
chaosblade-box-5bc47b676f-2gjh9         1/1     Running   0          15d
chaosblade-box-mysql-58cc864896-2jxrs   1/1     Running   0          15d
```
If your actual output matches the expected output, ChaosBlade-Box has been installed successfully.
> ⚠️Attention
> If the actual output **STATUS** is not Running, you need to run the following command to view Pod details, and then troubleshoot the problem according to the error message.
```shell
# As chaosblade-box example
kubectl describe po chaosblade-box-5bc47b676f-2gjh9 -n chaosblade
```
> If you are using Apple's m1/m2 chip, please replace the image of chaosblade-box-mysql to arm64v8/mysql:8.0-oraclelinux8, otherwise there will be an error message
> no matching manifest for linux/arm64/v8 in the manifest list entries
###  Uninstall ChaosBlade-Box
To uninstall ChaosBladder-box, run the following command:
```shell
helm un chaosblade-box -n chaosblade
```
