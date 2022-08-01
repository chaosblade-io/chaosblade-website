---
id: blade create k8s container-cpu
---

# 模拟容器内CPU负载实验场景

ChaosBlade 提供的的 k8s 实验类型支持通过**容器** Cpu 负载实验，可通过命令行、Yaml、控制台三种方式向 k8s 集群中注入节点 CPU 负载异常故障。本文档介绍如何通过命令行、Yaml方式创建 k8s 容器 CPU 负载实验。

## 场景介绍
kubernetes 下 容器内 CPU 负载实验场景，同基础资源的 CPU 场景。该场景可向指定容器注入 CPU 负载异常，注入后容器所在 pod cpu 使用率将提升。

支持 CPU 场景命令如下：
* `blade create k8s container-cpu load`，容器内 CPU 负载场景，同 [blade create cpu load](https://chaosblade.io/docs/experiment-types/host/blade_create_cpu_load)


## 参数
除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：

|  参数名 |  说明 | 类型 | 值 |
|  ----  | ---- | ---- | ---- |
| `container-ids` | 容器ID，支持配置多个 | string | 默认值：“”，和容器名称必填其一 |
| `container-names` | 容器名称，支持配置多个 | string | 默认值：“”，和容器id必填其一  |
| `docker-endpoint` | Docker server 地址  | string | ，默认为本地的 /var/run/docker.sock |
| ```namespace``` | Pod 所属的命名空间，只能填写一个值，必填项 | string | 必填 |
| ```evict-count``` | 限制实验生效的数量 | string | 可选 |
| ```evict-percent``` | 限制实验生效数量的百分比，不包含 % | string | 可选 |
| ```labels``` | Pod 资源标签，多个标签之前是或的关系 | string | 可选 |
| ```names``` | Pod 资源名 | string | 必填 |
| ```kubeconfig``` | kubeconfig 文件全路径（仅限使用 blade 命令调用时使用） | string | blade命令行调用时必填 |
| ```waiting-time``` | 实验结果等待时间 | string | 默认为20s，参数值要包含单位，例如 10s，1m |

## 示例

### Blade命令创建实验

```shell
blade create k8s container-cpu fullload --cpu-percent 100 --container-ids 2ff814b246f86 --names frontend-d89756ff7-pbnnc --namespace default --kubeconfig config 
```

如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```
{"code":200,"success":true,"result":"092e8b4d88d4f449"}
```

可通过```kubectl top pod -n default```查看实验是否生效
```
frontend-d89756ff7-pbnnc                               3005m        150Mi
kube-state-metrics-67b576794c-9ps5d                    1m           23Mi
node-exporter-627qc                                    1m           34Mi
node-exporter-ksnbz                                    2m           37Mi
```

可通过以下命令查询实验状态：
```
blade query k8s create 092e8b4d88d4f449 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"092e8b4d88d4f449","success":true,"error":"","statuses":[{"id":"eab5fb70b61c9c45","uid":"2ff814b246f86aba2392379640e4c6b16efbfd61846fc419a24f8d8ccf0f86f0","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.204"}]}}
```

销毁实验：
```
blade destroy 092e8b4d88d4f449
```

### Yaml方式创建实验

指定 default 命名空间下 Pod 名为 frontend-d89756ff7-pbnnc，容器id为 2ff814b246f86，做 CPU 负载 100% 实验举例。

**yaml 配置方式** 
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: increase-container-cpu-load-by-id
spec:
  experiments:
  - scope: container
    target: cpu
    action: fullload
    desc: "increase container cpu load by id"
    matchers:
    - name: container-ids
      value:
      - "2ff814b246f86"
    - name: cpu-percent
      value: ["100"]
      # pod names
    - name: names
      value: ["frontend-d89756ff7-pbnnc"]
```
例如配置好文件后，保存为 increase_container_cpu_load_by_id.yaml，使用以下命令执行实验场景：
```
kubectl apply -f increase_container_cpu_load_by_id.yaml
```
可通过以下命令查看每个实验的执行状态：
```
kubectl get blade increase-container-cpu-load-by-id -o json
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
        "name": "increase-container-cpu-load-by-id",
        "resourceVersion": "9432486",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/increase-container-cpu-load-by-id",
        "uid": "737ae2e8-ff79-11e9-a8e2-00163e08a39b"
    },
    "status": {
        "expStatuses": [
            {
                "action": "fullload",
                "resStatuses": [
                    {
                        "id": "2bcb4178003f46fe",
                        "kind": "container",
                        "name": "php-redis",
                        "nodeName": "cn-hangzhou.192.168.0.204",
                        "state": "Success",
                        "success": true,
                        "uid": "2ff814b246f86aba2392379640e4c6b16efbfd61846fc419a24f8d8ccf0f86f0"
                    }
                ],
                "scope": "container",
                "state": "Success",
                "success": true,
                "target": "cpu"
            }
        ],
        "phase": "Running"
    }
}
 ```
 
 通过资源监控，可以看到此 Pod 下 CPU 使用情况
 ![monitor](https://user-images.githubusercontent.com/3992234/68177462-5cac1d80-ffc3-11e9-8c8f-4854f3eb4315.png)

使用以下命令停止实验：
```
kubectl delete -f examples/increase_container_cpu_load_by_id.yaml 
```

## 常见问题
其他问题参考 [blade create k8s](https://chaosblade.io/docs/experiment-types/k8s/blade_create%_k8s) 常见问题