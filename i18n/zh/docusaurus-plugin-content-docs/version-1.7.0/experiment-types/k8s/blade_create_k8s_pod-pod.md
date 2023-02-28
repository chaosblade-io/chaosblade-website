---
id: blade create k8s pod-pod
---

# 模拟Pod资源自身场景

## 介绍
kubernetes Pod 资源自身场景，比如删除 Pod

## 命令
支持的场景命令如下：
* `blade create k8s pod-pod delete` 删除 POD

## 参数
除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

| 参数名             | 说明                                   | 类型     | 值                       |
|-----------------|--------------------------------------|--------|-------------------------|
| `evict-count`   | 限制实验生效的数量                            | int    |                         |
| `evict-percent` | 限制实验生效数量的百分比，不包含 %                   | int    |                         |
| `namespace`     | Pod 所属的命名空间，只能填写一个值，必填项              | string | 例:`default`             |
| `labels`        | Pod 资源标签，多个标签之间是或的关系                 | string |                         |
| `names`         | Pod 资源名                              | string |                         |
| `kubeconfig`    | kubeconfig 文件全路径（仅限使用 blade 命令调用时使用） | string | 例: "/root/.kube/config" |
| `waiting-time`  | 实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m  | string |                         |



## 案例
删除指定 default 命名空间下标签是 app=guestbook 的 pod，删除

**yaml配置方式如下**
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delete-two-pod-by-labels
spec:
  experiments:
  - scope: pod
    target: pod
    action: delete
    desc: "delete pod by labels"
    matchers:
    - name: labels
      value:
      - "app=guestbook"
    - name: namespace
      value:
      - "default"
    - name: evict-count
      value:
      - "2"
```

保存文件为 delete_pod_by_labels.yaml，使用 `kubectl apply -f delete_pod_by_labels.yaml` 命令执行，可以看到执行前后，指定数量的 Pod 被杀掉后，又被重新拉起
![before](https://user-images.githubusercontent.com/3992234/68177298-d68fd700-ffc2-11e9-9318-f3769829fac2.png)
![after](https://user-images.githubusercontent.com/3992234/68177283-caa41500-ffc2-11e9-80d7-a82f0f04f118.png)



通过 `kubectl get blade delete-two-pod-by-labels -o json` 可以查看详细的执行结果(下发只截取部分内容)
```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "delete-two-pod-by-labels",
        "resourceVersion": "9423460",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/delete-two-pod-by-labels",
        "uid": "f31da567-ff71-11e9-a8e2-00163e08a39b"
    },
    "status": {
        "expStatuses": [
            {
                "action": "delete",
                "resStatuses": [
                    {
                        "kind": "pod",
                        "name": "frontend-d89756ff7-94fj6",
                        "nodeName": "cn-hangzhou.192.168.0.203",
                        "state": "Success",
                        "success": true,
                        "uid": "79cd691c-fe3a-11e9-8883-00163e0ad0b3"
                    },
                    {
                        "kind": "pod",
                        "name": "frontend-d89756ff7-dkgmd",
                        "nodeName": "cn-hangzhou.192.168.0.205",
                        "state": "Success",
                        "success": true,
                        "uid": "79d1f47e-fe3a-11e9-8883-00163e0ad0b3"
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
kubectl delete -f delete_pod_by_labels.yaml 
```
或者直接删除 blade 资源：
```
kubectl delete blade delete-two-pod-by-labels
```
删除 Pod 的停止实验操作，chaosblade 本身不会重新拉起被删除的 Pod，只是去更改实验状态！！

**blade 执行方式**
```
blade create k8s pod-pod delete --labels app=guestbook --namespace default --evict-count 2 --kubeconfig config
```
如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```
{"code":200,"success":true,"result":"4d3caa0a99c3b2dd"}
```
可通过以下命令查询实验状态：
```
blade query k8s create 4d3caa0a99c3b2dd --kubeconfig config

{"code":200,"success":true,"result":{"uid":"4d3caa0a99c3b2dd","success":true,"error":"","statuses":[{"uid":"f325d43c-ff71-11e9-8883-00163e0ad0b3","name":"frontend-d89756ff7-5wgg5","state":"Success","kind":"pod","success":true,"nodeName":"cn-hangzhou.192.168.0.203"},{"uid":"28af19dd-f987-11e9-bd30-00163e08a39b","name":"frontend-d89756ff7-dpv7h","state":"Success","kind":"pod","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```
销毁实验：
```
blade destroy 4d3caa0a99c3b2dd
```

## 常见问题
其他问题参考 [blade create k8s](./blade%20create%20k8s) 常见问题
