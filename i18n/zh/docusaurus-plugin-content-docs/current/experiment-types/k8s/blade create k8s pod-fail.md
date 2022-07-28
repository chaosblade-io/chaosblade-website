---
id: blade create k8s pod-fail
---

# 模拟Pod不可用

## 介绍
kubernetes Pod 资源自身场景, 所选的 Pod 在指定的时间段内将不可用

## 命令


## 参数


## 案例
使指定 default 命名空间下标签是 app=guestbook 的 pod 服务不可用

**yaml配置方式如下**
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: fail-pod-by-labels
spec:
  experiments:
  - scope: pod
    target: pod
    action: fail
    desc: "inject fail image to  select pod"
    matchers:
    - name: labels
      value:
      - "app=guestbook"
    - name: namespace
      value:
      - "default"
```

保存文件为 fail_pod_by_labels.yaml，使用 `kubectl apply -f fail_pod_by_labels.yaml` 命令执行，可以看到执行前后，指定的 Pod 无法拉取镜像，删除实验之后，Pod 又恢复正常
```shell script
frontend-5d944bddbb-8w9ff   1/1     Running   0          45h
frontend-5d944bddbb-8w9ff   1/1     Running   0          45h
frontend-5d944bddbb-8w9ff   0/1     ErrImagePull   0          45h
frontend-5d944bddbb-8w9ff   0/1     ImagePullBackOff   0          45h
frontend-5d944bddbb-8w9ff   0/1     ErrImagePull       0          45h
frontend-5d944bddbb-8w9ff   0/1     ImagePullBackOff   0          45h
frontend-5d944bddbb-8w9ff   0/1     CrashLoopBackOff   0          45h
frontend-5d944bddbb-8w9ff   0/1     ErrImagePull       0          45h
```

```shell script
frontend-5d944bddbb-8w9ff   0/1     Terminating        0          45h
frontend-5d944bddbb-8sll8   0/1     Pending            0          0s
frontend-5d944bddbb-8sll8   0/1     Pending            0          0s
frontend-5d944bddbb-8w9ff   0/1     Terminating        0          45h
frontend-5d944bddbb-8sll8   0/1     ContainerCreating   0          0s
frontend-5d944bddbb-8sll8   1/1     Running             0          4s
frontend-5d944bddbb-8w9ff   0/1     Terminating         0          45h
frontend-5d944bddbb-8w9ff   0/1     Terminating         0          45h
```


通过 `kubectl get blade fail-pod-by-labels -o json` 可以查看详细的执行结果(下发只截取部分内容)
```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "creationTimestamp": "2020-07-05T01:18:01Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "fail-pod-by-labels",
        "resourceVersion": "149831443",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/fail-pod-by-labels",
        "uid": "5e7c42f8-be5d-11ea-b2c3-00163f003dea"
    },
    "spec": {
        "experiments": [
            {
                "action": "fail",
                "desc": "inject fail image to  select pod",
                "matchers": [
                    {
                        "name": "labels",
                        "value": [
                            "app=guestbook"
                        ]
                    },
                    {
                        "name": "namespace",
                        "value": [
                            "default"
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
                "action": "fail",
                "resStatuses": [
                    {
                        "kind": "pod",
                        "name": "frontend-5d944bddbb-8w9ff",
                        "nodeName": "qa.op.k8s.008120.hz",
                        "state": "Success",
                        "success": true,
                        "uid": "5187a405-be5d-11ea-a750-00163e0dc939"
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

执行以下命令停止实验：
```
kubectl delete -f fail_pod_by_labels.yaml
```
或者直接删除 blade 资源：
```
kubectl delete blade fail-pod-by-labels
```
Pod 不可用的停止实验操作，chaosblade 会重新拉起被删除的 Pod 


## 常见问题
其他问题参考 [blade create k8s](blade create k8s.md) 常见问题
