---
title: "文件系统 I/O 故障"
linkTitle: "文件系统 I/O 故障"
weight: 1
type: docs
description: > 
    Kubernetes Pod 文件系统 I/O 故障
---
给 kubernetes 的 pod 注入文件系统I/O故障。

{{% pageinfo color="primary" %}}
注意：此场景需要激活 `--webhook-enable` 参数，如需使用此功能，请在 chaosblade-operator 参数中添加 `--webhook-enable`，或者在安装时指定：例如 helm 安装时添加 `--set webhook.enable=true` 指定。
{{% /pageinfo %}}

### 实验参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `methods` | string | I/O故障方法。 |
| `delay` | string | I/O延迟时间。 |
| `errno` | string | 指定特性的I/O异常错误码。 |
| `random` | string | 随机产生I/O异常错误码。 |
| `percent` | string | I/O错误百分比 [0-100]。 |
| `path` | string | I/O异常的目录或者文件。 |

### 前提条件

- 集群中部署了 `chaosblade-admission-webhook`
- 需要注入故障的 `volume` 设置 `mountPropagation` 为 `HostToContainer`
- pod 上面添加了如下 `annotations`:
    ```yaml
    chaosblade/inject-volume: "data" //需要注入故障的volume name
    chaosblade/inject-volume-subpath: "conf" //volume挂载的子目录
    ```

### 部署测试 pod

chaosblade webhook 会根据 pod 的 annotation，注入 fuse 的 sidecar 容器：

1. `chaosblade/inject-volume` 指明需要注入故障的 volume name，比如例子中的 `data`。
2. `chaosblade/inject-volume-subpath` 指明 volume 挂载路径的子目录。上面的例子中，volume 的挂载路径是 `/data`,子目录是 `conf`，则在 pod 内，注入I/O异常的目录是 `/data/conf`。
3. 指定需要注入故障的 volume 需要指定 `mountPropagation：HostToContainer`，这个字段的含义可以参考官方文档 [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation)。

测试 pod 配置文件：`io-test-pod.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: test
  name: test
  namespace: chaosblade
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

**部署**

```bash
# 部署测试 pod
$ kubectl apply -f io-test-pod.yaml
# 查看 sidecar 是否注入成功
$ kubectl get pod test-7c9fc6fd88-7lx6b -n chaosblade
NAME                    READY   STATUS    RESTARTS   AGE
test-7c9fc6fd88-7lx6b   2/2     Running   0          4m8s
```

### 配置文件

实验配置文件：`pod_io.yaml`

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
      - "chaosblade"
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

### 开始实验

执行命令，开始实验：

```bash
kubectl apply -f pod_io.yaml
```

### 查看实验状态

执行 `kubectl get blade inject-pod-by-labels -o json ` 命令，查看实验状态：

```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"chaosblade.io/v1alpha1\",\"kind\":\"ChaosBlade\",\"metadata\":{\"annotations\":{},\"name\":\"inject-pod-by-labels\"},\"spec\":{\"experiments\":[{\"action\":\"IO\",\"desc\":\"Pod IO Exception by labels\",\"matchers\":[{\"name\":\"labels\",\"value\":[\"app=test\"]},{\"name\":\"namespace\",\"value\":[\"chaosblade\"]},{\"name\":\"method\",\"value\":[\"read\"]},{\"name\":\"delay\",\"value\":[\"1000\"]},{\"name\":\"path\",\"value\":[\"\"]},{\"name\":\"percent\",\"value\":[\"60\"]},{\"name\":\"errno\",\"value\":[\"28\"]}],\"scope\":\"pod\",\"target\":\"pod\"}]}}\n"
        },
        "creationTimestamp": "2020-06-02T07:45:31Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "inject-pod-by-labels",
        "resourceVersion": "7725368",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/inject-pod-by-labels",
        "uid": "302bed87-0dce-4179-8b25-6a87588906fa"
    },
    "spec": {
        "experiments": [
            {
                "action": "IO",
                "desc": "Pod IO Exception by labels",
                "matchers": [
                    {
                        "name": "labels",
                        "value": [
                            "app=test"
                        ]
                    },
                    {
                        "name": "namespace",
                        "value": [
                            "chaosblade"
                        ]
                    },
                    {
                        "name": "method",
                        "value": [
                            "read"
                        ]
                    },
                    {
                        "name": "delay",
                        "value": [
                            "1000"
                        ]
                    },
                    {
                        "name": "path",
                        "value": [
                            ""
                        ]
                    },
                    {
                        "name": "percent",
                        "value": [
                            "60"
                        ]
                    },
                    {
                        "name": "errno",
                        "value": [
                            "28"
                        ]
                    }
                ],
                "scope": "pod",
                "target": "pod"
            }
        ]
    },
    "status": {
        "expStatuses": [
            {
                "action": "IO",
                "resStatuses": [
                    {
                        "kind": "pod",
                        "name": "test-7c9fc6fd88-7lx6b",
                        "nodeName": "keking",
                        "state": "Success",
                        "success": true,
                        "uid": "18fd4930-28d0-41f2-b8af-7dc9f08b39a8"
                    }
                ],
                "scope": "pod",
                "state": "Success",
                "success": true,
                "target": "pod"
            }
        ],
        "phase": "Running"
    }
}
```

### 观测结果

```bash
# 进入实验 pod
$ kubectl exec -it test-7c9fc6fd88-7lx6b bash
# 在 pod 内读取指定目录中的文件，如果没有可以新建一个
$ time cat /data/conf/test.yaml
cat: read error: No space left on device

real    0m3.007s
user    0m0.002s
sys     0m0.002s
# 因为有重试，显示有 3s 的延迟
# 因为设置了 60% 的异常，所有还是有成功的情况
$ time cat /data/conf/test.yaml
123

real    0m0.004s
user    0m0.002s
sys     0m0.000s
```

![io-pod-read](https://github.com/sunny0826/chaosblade-operator-experiment/raw/master/static/io-pod-read.gif)

在本例中，我们对 read 操作注入两种异常，异常率为百分之60:

- 对 `read` 操作增加 1s 的延迟。
- 对 `read` 操作返回错误 `28`。

这里只是做了一种类型的实验，更多的实验类型详见[官方文档](https://chaosblade-io.gitbook.io/chaosblade-help-zh-cn/blade-create-k8s/blade-create-k8s-pod-io)。

### 停止实验

执行命令：`kubectl delete -f pod_io.yaml`

或者直接删除 blade 资源：`kubectl delete blade inject-pod-by-labels`

删除测试 pod：`kubectl delete -f io-test-pod.yaml`

### 附录

**支持的I/O故障方法**

`open`
`read`
`write`
`mkdir`
`rmdir`
`opendir`
`fsync`
`flush`
`release`
`truncate`
`getattr`
`chown`
`chmod`
`utimens`
`allocate`
`getlk`
`setlk`
`setlkw`
`statfs`
`readlink`
`symlink`
`create`
`access`
`link`
`mknod`
`rename`
`unlink`
`getxattr`
`listxattr`
`removexattr`
`setxattr`

**I/O异常错误码**


| 错误码 | 错误信息|
| --- | --- |
| `1` | `Operation not permitted` |
| `2` | `No such file or directory` |
| `5` | `I/O error` |
| `6` | `No such device or address` |
| `12` | `Out of memory` |
| `16` | `Device or resource busy` |
| `17` | `File exists` |
| `20` | `Not a directory` |
| `22` | `Invalid argument` |
| `24` | `Too many open files` |
| `28` | `No space left on device` |
