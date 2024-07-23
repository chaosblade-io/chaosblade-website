---
id: blade create k8s node-network
---

# 模拟节点网络相关场景

## 介绍
kubernetes 节点网络相关场景，同基础资源的网络场景

## 命令
支持的网络场景命令如下：
* `blade create k8s node-network delay` 节点网络延迟场景，同 [blade create network delay](../host/blade_create_network_delay)
* `blade create k8s node-network loss` 节点网络丢包场景，同 [blade create network loss](../host/blade_create_network_loss)
* `blade create k8s node-network dns` 节点域名访问异常场景，同 [blade create network dns](../host/blade_create_network_dns)

## 参数
除了上述场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

|  参数名 |  说明 | 类型 | 值 |
|  ----  | ---- | ---- | ---- |
| `evict-count`         | 限制实验生效的数量 | int |  |
| `evict-percent`       | 限制实验生效数量的百分比，不包含 % | int | |
| `labels`              | Pod 资源标签，多个标签之间是或的关系 | string | |
| `names`               | Pod 资源名 | string | |
| `kubeconfig`          | kubeconfig 文件全路径（仅限使用 blade 命令调用时使用） | string | 例: "/root/.kube/config" |
| `waiting-time`        | 实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m | string | |

## 案例
对 cn-hangzhou.192.168.0.205 节点本地端口 40690 访问丢包率 60%

**yaml 配置方式**
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: loss-node-network-by-names
spec:
  experiments:
  - scope: node
    target: network
    action: loss
    desc: "node network loss"
    matchers:
    - name: names
      value: ["cn-hangzhou.192.168.0.205"]
    - name: percent
      value: ["60"]
    - name: interface
      value: ["eth0"]
    - name: local-port
      value: ["40690"]
```
保存为 yaml 文件，比如 loss-node-network-by-names.yaml，使用 kubectl 命令执行：
```
kubectl apply -f loss-node-network-by-names.yaml
```
实验状态查询：
```
kubectl get blade loss-node-network-by-names -o json
``` 
返回结果如下(省略了一部分)：
```json
~ » kubectl get blade loss-node-network-by-names -o json                                                            
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "creationTimestamp": "2019-11-04T09:56:36Z",
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "loss-node-network-by-names",
        "resourceVersion": "9262302",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/loss-node-network-by-names",
        "uid": "63a926dd-fee9-11e9-b3be-00163e136d88"
    },
        "status": {
        "expStatuses": [
            {
                "action": "loss",
                "resStatuses": [
                    {
                        "id": "057acaa47ae69363",
                        "kind": "node",
                        "name": "cn-hangzhou.192.168.0.205",
                        "nodeName": "cn-hangzhou.192.168.0.205",
                        "state": "Success",
                        "success": true,
                        "uid": "e179b30d-df77-11e9-b3be-00163e136d88"
                    }
                ],
                "scope": "node",
                "state": "Success",
                "success": true,
                "target": "network"
            }
        ],
        "phase": "Running"
    }
}
```

执行以下命令停止实验：
```
kubectl delete -f loss-node-network-by-names.yaml
```
或者直接删除 blade 资源：
```
kubectl delete blade loss-node-network-by-names
```

**blade 执行方式**
```
blade create k8s node-network loss --percent 60 --interface eth0 --local-port 40690 --kubeconfig config --names cn-hangzhou.192.168.0.205
```
如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```
{"code":200,"success":true,"result":"e647064f5f20953c"}
```
可通过以下命令查询实验状态：
```json
blade query k8s create e647064f5f20953c --kubeconfig config

{"code":200,"success":true,"result":{"uid":"e647064f5f20953c","success":true,"error":"","statuses":[{"id":"fa471a6285ec45f5","uid":"e179b30d-df77-11e9-b3be-00163e136d88","name":"cn-hangzhou.192.168.0.205","state":"Success","kind":"node","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```
销毁实验：
```
blade destroy e647064f5f20953c
```

## 常见问题
其他问题参考 [blade create k8s](./blade_create_k8s) 常见问题
