---
id: blade create k8s container-container
---

# 模拟容器资源自身场景

该文档介绍如何 Kubernetes 环境下模拟 Container 自身资源相关的场景故障，如删除容器。

## 场景介绍

Kubernetes 下 container 资源自身的场景，比如删容器，需要注意，执行容器场景，必须先确定 Pod，所以需要配置 Pod 相关参数。

验证 Pod 内容器消失、删除情况对系统服务的影响，以及集群是否能正常自动恢复被删除的容器进程。

## 命令
支持场景命令如下
* `blade create k8s container-container remove` 删除容器 

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

### Blade命令创建实验

```
blade create k8s container-container remove --container-ids 060833967b0a37 --names frontend-d89756ff7-szblb --namespace default --kubeconfig config
```
如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```bash
{"code":200,"success":true,"result":"17d7021c777b76e3"}
```
可通过以下命令查询实验状态：
```bash
blade query k8s create 17d7021c777b76e3 --kubeconfig config

{"code":200,"success":true,"result":{"uid":"17d7021c777b76e3","success":true,"error":"","statuses":[{"id":"205515ad8fcc31da","uid":"060833967b0a3733d10f0e64d3639066b8b7fbcf371e0ace2401af150dbd9b12","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.205"}]}}
```
销毁实验：
```
blade destroy 17d7021c777b76e3
```

删除容器后，执行销毁实验命令不会恢复容器，需要靠容器自身的管理拉起！

### Yaml方式创建实验

删除 default 命名空间下，Pod 名为 frontend-d89756ff7-szblb 下的 container id 是 072aa6bbf2e2e2 的容器

**yaml 配置方式**
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: remove-container-by-id
spec:
  experiments:
  - scope: container
    target: container
    action: remove
    desc: "remove container by id"
    matchers:
    - name: container-ids
      value: ["072aa6bbf2e2e2"]
      # pod name
    - name: names
      value: ["frontend-d89756ff7-szblb"]
    - name: namespace
      value: ["default"]
```
保存为 yaml 文件，比如 remove_container_by_id.yaml，使用 kubectl 命令执行：
```
kubectl apply -f remove_container_by_id.yaml
```
实验状态查询：
```
kubectl get blade remove-container-by-id -o json
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
                "name": "remove-container-by-id",
                "resourceVersion": "9429224",
                "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/remove-container-by-id",
                "uid": "bb1482ea-ff76-11e9-8883-00163e0ad0b3"
            },
            "status": {
                "expStatuses": [
                    {
                        "action": "remove",
                        "resStatuses": [
                            {
                                "id": "f5bfa325da504cac",
                                "kind": "container",
                                "name": "php-redis",
                                "nodeName": "cn-hangzhou.192.168.0.205",
                                "state": "Success",
                                "success": true,
                                "uid": "072aa6bbf2e2e286ec77b4b05440107b48aeebae6aea06e8e3a65b40e4f40326"
                            }
                        ],
                        "scope": "container",
                        "state": "Success",
                        "success": true,
                        "target": "container"
                    }
                ],
                "phase": "Running"
            }
        }
    ],
}
```

执行前后，可以看到 Pod 内容器的变化:
![before](https://user-images.githubusercontent.com/3992234/68177415-2ff80600-ffc3-11e9-8bd3-ea8d66bf935d.png)
![after](https://user-images.githubusercontent.com/3992234/68177442-4ef69800-ffc3-11e9-9f5a-910d477b131a.png)


执行以下命令停止实验：
```
kubectl delete -f remove_container_by_id.yaml
```
或者直接删除 blade 资源：
```
kubectl delete blade remove-container-by-id
```

删除容器后，执行销毁实验命令不会恢复容器，需要靠容器自身的管理拉起！


## 注意事项

删除容器的场景下，执行销毁实验命令不会恢复容器，需要靠容器自身的管理拉起！请谨慎使用


## 常见问题
其他问题参考 [blade create k8s](./blade_create_k8s.md) 常见问题
