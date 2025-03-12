---
authors: caofujiang
title: 混沌实验不设限:ChaosBlade如何完美兼容CRI-O?
tags: [ chaosblade ]
hide_table_of_contents: false
---


## 前言
   ChaosBlade是一个超实用的混沌工程工具，以前主要兼容 Docker 和 Containerd 运行时，搞搞容器的 CPU、内存、网络等故障注入，简直不要太爽！
但，问题来了……
越来越多的人开始用 CRI-O 了！
   CRI-O 是 Kubernetes 官方推荐的轻量级容器运行时，和 Docker、Containerd 不是一个套路。既然大家都在用，那我们 ChaosBlade 当然不能落后， 
必须支持一波。于是，这就有了这篇适配 CRI-O 的大冒险！

<!--truncate-->

## 第一步：搞清楚 CRI-O 是个啥？
   CRI-O 本质上就是一个专为 Kubernetes 设计的轻量级容器运行时，它直接实现了 Kubernetes 的 CRI（Container Runtime Interface）接口， 
旨在提供高效、稳定的容器运行环境。与 Docker 不同，CRI-O仅关注 Kubernetes 运行时需求，不包含额外的镜像构建和运行功能，只负责让 kubelet 能顺利管理容器， 
底层用的是 runc 或 crun，它支持所有符合 OCI（Open Container Initiative）标准 的运行时，这使其更加轻量、稳定。

  ![image.png](/img/blog/chaosblade-crio-architecture.png)
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  CRI-O 架构图


它和 Kubernetes 之间通过 **gRPC** 进行通信，而我们操控它可以用 `crictl` 命令，比如：

- crictl ps                              # 查看运行中的容器 
- crictl inspect container-id            # 获取容器详细信息 
- crictl exec -it container-id -- bash   # 进入容器 


与 Docker、Containerd 的对比：

![image.png](/img/blog/chaosblade-crio-compare.png)




所以，ChaosBlade 要支持 CRI-O，最重要的就是：**用 `crictl` 替换原来的 `docker` 或 `ctr` 命令！**

## **第二步：让 ChaosBlade 识别 CRI-O**

首先，我们得想办法知道**当前运行时是 CRI-O 还是 Docker 或 Containerd**，不然操作容器的时候就尴尬了……

**方法 1：通过 `kubectl get nodes` 看运行时**

`kubectl get nodes -o wide `

如果某一列显示 `cri-o://1.25.0` 之类的，那基本上就跑不掉了。

![image.png](/img/blog/chaosblade-crio-show.png)


**方法 2：看 CRI 配置文件**

`cat /etc/crictl.yaml`

如果这里面写着 `runtime-endpoint: unix:///var/run/crio/crio.sock`，恭喜你，**CRI-O 无疑！**

我们把这个逻辑放进 Go 代码里，动态检测运行时类型：

```  go
 package runtime   
 import (    	
 "os/exec"    	
 "strings" 
 )  
  
 // GetContainerRuntime 获取当前容器运行时 
 func GetContainerRuntime() string {    	
    cmd := exec.Command("kubectl", "get", "nodes", "-o", "wide")    	
    output, err := cmd.CombinedOutput()    
    if err != nil {           
    		return "unknown"    	
    }    	
    if strings.Contains(string(output), "cri-o") {           
    		return "cri-o"    	
    } else if strings.Contains(string(output), "containerd") {           	
    	  return "containerd"    	
    } else if strings.Contains(string(output), "docker") {           	
    	return "docker"    	
    }    	
    return "unknown" 
 } 
 
```

这样一来，我们就能知道自己面对的是什么运行时了！


## **第三步：让 ChaosBlade 用 `crictl` 代替 `docker` 操作容器**

以前的代码是这么玩的：

```
cmd := exec.Command("docker", "exec", containerId, "sh", "-c", "stress --cpu 1") 
```


如果换成 CRI-O，就得改成 `crictl` 命令！

```
runtime := GetContainerRuntime() 
var cmd *exec.Cmd
 if runtime == "cri-o" { 	
 cmd = exec.Command("crictl", "exec", "-it", containerId, "sh", "-c", "stress --cpu 1")
  } else { 
  	cmd \= exec.Command("docker", "exec", containerId, "sh", "-c", "stress --cpu 1") 
  } 
}
```

这样，ChaosBlade 就能智能适配不同的运行时了！

## **第四步：获取容器 ID，才能精确打击！**

在 CRI-O 里，容器 ID 不能用 `docker ps` 查，而是得用：

```
crictl ps | grep <pod-name> 
```

于是，我们在 Go 代码里写一个自动查找容器 ID 的函数：

``` 
func GetContainerIDByPod(podName string) (string, error) { 	
   cmd := exec.Command("crictl", "ps") 	
   output, err := cmd.CombinedOutput() 
   	if err != nil {    
   	 	return "", err 
   	 } 	
   	 lines := strings.Split(string(output), "\n") 	
   	 for _, line := range lines {     	
   	 if strings.Contains(line, podName) { 
   	        fields := strings.Fields(line)         	
   	        if len(fields) > 0 {             
   	        	return fields[0], nil // 返回容器 ID         	
   	        	}     	
   	        } 	
   	      } 	
   	 return "", fmt.Errorf("container not found for pod: %s", podName)
   } 
```

这样，ChaosBlade 就能在 **CRI-O 运行时** 里精确找到目标容器，然后实施相应的混沌攻击了！

## **第五步：测试 & 验证！**

### 5.1. 检查 CRI-O 运行时是否 OK

```
crictl info | grep "runtimeType" 

```

如果输出是 `"runtimeType": "cri-o"`，那一切正常！

### 5.2. 用 ChaosBlade 进行 CPU 负载测试

```
blade create docker cpu load --container-id <container-id> --cpu-percent 80 |
```

如果 CRI-O 生效了，它会自动切换到：

```
crictl exec -it <container-id> -- stress --cpu 1 |
```

然后我们可以 `top` 或 `htop` 看到 CPU 直接拉满！

### 5.3. 检查 Pod 状态
```
kubectl describe pod <pod-name> 
```

如果 Pod 没炸，那说明改造是成功的！

## **总结：ChaosBlade 变得更强了！**

**这次适配 CRI-O，我们主要做了 3 件事：**

- **检测运行时类型**，自动判断是 Docker、Containerd 还是 CRI-O。

- **改用** `crictl` **进行pod、容器操作**，完美兼容 CRI-O 运行时。

-  **优化容器 ID 解析**，让 ChaosBlade 能精准攻击 CRI-O 容器。

这样一来，**ChaosBlade 在 Kubernetes 里的适用性更强了 **，无论你是用 **Docker、Containerd，还是 CRI-O**，都能随意折腾！




