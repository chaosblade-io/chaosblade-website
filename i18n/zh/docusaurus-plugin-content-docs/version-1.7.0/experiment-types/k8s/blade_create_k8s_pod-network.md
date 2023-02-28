---
id: blade create k8s pod-network
---

# 模拟Pod网络相关场景

## 介绍
kubernetes Pod网络相关场景，同基础资源的网络场景

## 命令
支持的网络场景命令如下：
* `blade create k8s pod-network delay` Pod 网络延迟场景，同 [blade create network delay](../host/blade%20create%20network%20delay)
* `blade create k8s pod-network loss` Pod 网络丢包场景，同 [blade create network loss](../host/blade%20create%20network%20loss)
* `blade create k8s pod-network dns` Pod 域名访问异常场景，同 [blade create network dns](../host/blade%20create%20network%20dns)

## 参数
除了上述场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

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
对 default 命名空间下，指定名为 redis-slave-674d68586-jnf7f Pod本地端口 6379 访问延迟 3000 毫秒，延迟时间上下浮动 1000 毫秒

**yaml 配置方式**
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: delay-pod-network-by-names
spec:
  experiments:
  - scope: pod
    target: network
    action: delay
    desc: "delay pod network by names"
    matchers:
    - name: names
      value:
      - "redis-slave-674d68586-jnf7f"
    - name: namespace
      value:
      - "default"
    - name: local-port
      value: ["6379"]
    - name: interface
      value: ["eth0"]
    - name: time
      value: ["3000"]
    - name: offset
      value: ["1000"]
```
保存为 yaml 文件，比如 delay_pod_network_by_names.yaml，使用 kubectl 命令执行：
```
kubectl apply -f delay_pod_network_by_names.yaml
```
实验状态查询：
```
kubectl get blade delay-pod-network-by-names -o json
``` 
返回结果如下(省略了一部分)：
```json
{
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "chaosblade.io/v1alpha1",
            "kind": "ChaosBlade",
            "metadata": {
                "finalizers": [
                    "finalizer.chaosblade.io"
                ],
                "generation": 1,
                "name": "delay-pod-network-by-names",
                "resourceVersion": "9425766",
                "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/delay-pod-network-by-names",
                "uid": "cf32327c-ff73-11e9-b3be-00163e136d88"
            },
            "status": {
                "expStatuses": [
                    {
                        "action": "delay",
                        "resStatuses": [
                            {
                                "id": "e28f6e3ae2732a86",
                                "kind": "pod",
                                "name": "chaosblade-tool-vv49t", // 此pod为sidecar
                                "nodeName": "cn-hangzhou.192.168.0.204",
                                "state": "Success",
                                "success": true,
                                "uid": "4f1a28a1-fee6-11e9-8883-00163e0ad0b3"
                            }
                        ],
                        "scope": "pod",
                        "state": "Success",
                        "success": true,
                        "target": "network"
                    }
                ],
                "phase": "Running"
            }
        }
    ],
}
```

可通过访问服务，或者 telnet 命令验证实验效果

执行以下命令停止实验：
```
kubectl delete -f delay_pod_network_by_names.yaml
```
或者直接删除 blade 资源：
```
kubectl delete blade delay-pod-network-by-names
```

**blade 执行方式**
```
blade create k8s pod-network delay --time 3000 --offset 1000 --interface eth0 --local-port 6379 --names redis-slave-674d68586-jnf7f --namespace default --kubeconfig config
```
如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```
{"code":200,"success":true,"result":"127f1ee0afcd4798"}
```
可通过以下命令查询实验状态：
```
blade query k8s create 127f1ee0afcd4798 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"127f1ee0afcd4798","success":true,"error":"","statuses":[{"id":"b5a216dddeb3389f","uid":"4f1a28a1-fee6-11e9-8883-00163e0ad0b3","name":"chaosblade-tool-vv49t","state":"Success","kind":"pod","success":true,"nodeName":"cn-hangzhou.192.168.0.204"}]}}
```
销毁实验：
```
blade destroy 127f1ee0afcd4798
```

## 常见问题
其他问题参考 [blade create k8s](./blade%20create%20k8s) 常见问题
