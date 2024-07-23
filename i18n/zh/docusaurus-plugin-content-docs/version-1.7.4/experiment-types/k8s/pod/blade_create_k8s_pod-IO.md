---
title: 模拟 Pod 文件系统I/O异常
---

## 介绍

k8s pod 文件系统 I/O 异常场景，可以模拟对指定路径上的文件读写异常，包括延迟，错误等.

注意！！！此场景需要激活`--webhook-enable`参数，如需使用此功能，请在 chaosblade-operator 参数中添加 `--webhook-enable`，或者在安装时指定，例如 helm 安装时：
`--set webhook.enable=true` 指定。

## 前提条件

- 集群中部署了 chaosblade-admission-webhook
- 需要注入故障的 volume 设置 mountPropagation 为 HostToContainer
- pod 上面添加了如下 annotations:

```yaml
chaosblade/inject-volume: "data" #需要注入故障的volume name
chaosblade/inject-volume-subpath: "conf" #volume挂载的子目录
```

## 命令

blade create k8s pod-pod IO

## 参数

除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

```
--namespace string       Pod 所属的命名空间，只能填写一个值，必填项
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          Pod 资源标签，多个标签之前是或的关系
--names string           Pod 资源名
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
--methods string         I/O故障方法
--delay   string         I/O延迟时间
--errno   string         指定特性的I/O异常错误码
--random  string         随机产生I/O异常错误码
--percent string         I/O错误百分比 [0-100]
--path    string         I/O异常的目录或者文件
```

## 案例

首先，通过 deployment 部署测试 pod，并在 pod 的 annotation 里面指定需要注入 I/O 异常的 volume 以及子目录。

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: test
  name: test
  namespace: test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      annotations:
        chaosblade/inject-volume: data
        chaosblade/inject-volume-subpath: conf
      labels:
        app: test
    spec:
      containers:
        - command: ["/bin/sh", "-c", "while true; do sleep 10000; done"]
          image: busybox
          imagePullPolicy: IfNotPresent
          name: test
          volumeMounts:
            - mountPath: /data
              mountPropagation: HostToContainer
              name: data
      volumes:
        - hostPath:
            path: /data/fuse
          name: data
```

chaosblade webhook 会根据 pod 的 annotation，注入 fuse 的 sidecar 容器：

1. `chaosblade/inject-volume`指明需要注入故障的 volume name，比如例子中的`data`
2. `chaosblade/inject-volume-subpath`指明 volume 挂载路径的子目录。上面的例子中，volume 的挂载路径是`/data`,子目录是`conf`，则在 pod 内，注入 I/O 异常的目录是`/data/conf`。
3. 指定需要注入故障的 volume 需要指定`mountPropagation：HostToContainer`，这个字段的含义可以参考官方文档[Volumes](https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation)

通过上面的 yaml 文件创建 deployment 后，chaosblade webhook 会自动插入 sidecar 容器：

```bash
kubectl get pod -n test
NAME                   READY   STATUS    RESTARTS   AGE
test-bc7786698-k6tb7   2/2     Running   0          3m40s
```

这时虽然插入了 sidecar 容器，但是还没有注入 I/O 异常，可以通过下面的 yaml 注入相关的 I/O 异常：

```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: inject-pod-by-labels
spec:
  experiments:
    - scope: pod
      target: pod
      action: IO
      desc: "Pod IO Exception by labels"
      matchers:
        - name: labels
          value:
            - "app=test"
        - name: namespace
          value:
            - "test"
        - name: method
          value:
            - "read"
        - name: delay
          value:
            - "1000"
        - name: path
          value:
            - ""
        - name: percent
          value:
            - "60"
        - name: errno
          value:
            - "28"
```

在这里例子中，我们对`read`操作注入两种异常，异常率为百分之 60:

- 对`read`操作增加 1s 的延迟，支持的操作类型包括：

```
1. open
2. read
3. write
4. mkdir
5. rmdir
6. opendir
7. fsync
8. flush
9. release
10. truncate
11. getattr
12. chown
13. chmod
14. utimens
15. allocate
16. getlk
17. setlk
18. setlkw
19. statfs
20. readlink
21. symlink
22. create
23. access
24. link
25. mknod
26. rename
27. unlink
28. getxattr
29. listxattr
30. removexattr
31. setxattr
```

- 对`read`操作返回错误`28`，支持的错误码包括:

```
1: Operation not permitted
2: No such file or directory
5: I/O error
6: No such device or address
12: Out of memory
16: Device or resource busy
17: File exists
20: Not a directory
22: Invalid argument
24: Too many open files
28: No space left on device
```

当用上面的 yaml 文件注入 I/O 异常后，在 pod 内读取指定目录中的文件，发现返回了`No space left on device`，因为有重试，显示有`3s`的延迟。

```bash
kubectl exec  test-bc7786698-k6tb7 -c test -n test time cat /data/conf/file
cat: read error: No space left on device
Command exited with non-zero status 1
real    0m 3.00s
user    0m 0.00s
sys     0m 0.00s
```
