---
id: blade create k8s container-network
---

# 模拟容器内网络实验场景

## 介绍
kubernetes 下 容器内网络实验场景，同基础资源网络场景，由于同一个 Pod 内的容器共享 Pod 网络，所以效果同对 Pod 网络实验

## 命令
支持的网络场景命令如下：
* `blade create k8s container-network delay` container 网络延迟场景，同[blade create network delay](/docs/experiment-types/host/blade%20create%20network%20delay)
* `blade create k8s container-network loss` container 网络丢包场景，同 [blade create network loss](/docs/experiment-types/host/blade%20create%20network%20loss)
* `blade create k8s container-network dns` container 域名访问异常场景，同 [blade create network dns](/docs/experiment-types/host/blade%20create%20network%20dns)

## 参数
|  参数名 |  说明 | 类型 | 值 |
|  ----  | ---- | ---- | ---- |
| `container-ids`       | 容器ID，支持配置多个 | string |  |
| `container-names`     | 容器名称，支持配置多个 | string |  |
| `docker-endpoint `    | Docker server 地址 | string | 默认为本地的 /var/run/docker.sock | 
| `namespace`           | Pod 所属的命名空间，只能填写一个值，必填项 | string | 例：`default` |
| `evict-count`         | 限制实验生效的数量 | int |  |
| `evict-percent`       | 限制实验生效数量的百分比，不包含 % | int | |
| `labels`              | Pod 资源标签，多个标签之间是或的关系 | string | |
| `names`               | Pod 资源名 | string | |
| `kubeconfig`          | kubeconfig 文件全路径（仅限使用 blade 命令调用时使用） | string | 例: "/root/.kube/config" |
| `waiting-time`        | 实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m | string | |


## 案例
指定 default 命名空间下 Pod 名为 frontend-d89756ff7-pbnnc，容器id为 2ff814b246f86，做访问 www.baidu.com 域名异常实验举例。

### yaml 配置方式
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: tamper-container-dns-by-id
spec:
  experiments:
  - scope: container
    target: network
    action: dns
    desc: "tamper container dns by id"
    matchers:
    - name: container-ids
      value:
      - "4b25f66580c4"
    - name: domain
      value: ["www.baidu.com"]
    - name: ip
      value: ["10.0.0.1"]
      # pod names
    - name: names
      value: ["frontend-d89756ff7-trsxf"]
      # or use pod labels
```
例如配置好文件后，保存为 tamper_container_dns_by_id.yaml，使用以下命令执行实验场景：
 ```
 kubectl apply -f tamper_container_dns_by_id.yaml
 ```
 可通过以下命令查看每个实验的执行状态：
 ```
 kubectl get blade tamper_container_dns_by_id.yaml -o json
 ``` 
 ```json
{
    "apiVersion": "chaosblade.io/v1alpha1",
    "kind": "ChaosBlade",
    "metadata": {
        "finalizers": [
            "finalizer.chaosblade.io"
        ],
        "generation": 1,
        "name": "tamper-container-dns-by-id",
        "resourceVersion": "9435600",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/tamper-container-dns-by-id",
        "uid": "137372c2-ff7c-11e9-8883-00163e0ad0b3"
    },
        "status": {
        "expStatuses": [
            {
                "action": "dns",
                "resStatuses": [
                    {
                        "id": "1141530f66869a82",
                        "kind": "container",
                        "name": "php-redis",
                        "nodeName": "cn-hangzhou.192.168.0.203",
                        "state": "Success",
                        "success": true,
                        "uid": "4b25f66580c4dbf465a1b167c4c6967e987773442e5d47f0bee5db0a5e27a12d"
                    }
                ],
                "scope": "container",
                "state": "Success",
                "success": true,
                "target": "network"
            }
        ],
        "phase": "Running"
    }
}
 ```
 
 可以登录容器访问 www.baidu.com 域名进行验证
 
使用以下命令停止实验：
```
kubectl delete -f tamper_container_dns_by_id.yaml 
```

### blade 命令执行方式

```shell
blade create k8s container-network dns --domain www.baidu.com --ip 10.0.0.1 --names frontend-d89756ff7-trsxf --namespace default --container-ids 4b25f66580c4 --kubeconfig config 
```
如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```bash
{"code":200,"success":true,"result":"6e46a5df94e0b065"}
```
可通过以下命令查询实验状态：
```bash
blade query k8s create 6e46a5df94e0b065 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"6e46a5df94e0b065","success":true,"error":"","statuses":[{"id":"90304950e52d679e","uid":"4b25f66580c4dbf465a1b167c4c6967e987773442e5d47f0bee5db0a5e27a12d","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.203"}]}}
```
销毁实验：
```
blade destroy 6e46a5df94e0b065
```

## 常见问题
Q: {"code":504,"success":false,"error":"unexpected status, the real value is Error","result":{"uid":"623841684347c05f","success":false,"error":"unexpected status, the real value is Error","statuses":[{"uid":"4b25f66580c4dbf465a1b167c4c6967e987773442e5d47f0bee5db0a5e27a12d","name":"php-redis","state":"Error","kind":"container","error":"10.0.0.1 www.baidu.com #chaosblade has been exist exit status 1","success":false,"nodeName":"cn-hangzhou.192.168.0.203"}]}}
A: 所以实验已经存在

其他问题参考 [blade create k8s](/docs/experiment-types/k8s/blade%20create%20k8s) 常见问题
