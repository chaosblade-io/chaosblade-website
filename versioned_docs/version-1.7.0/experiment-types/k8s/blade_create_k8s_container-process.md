---
id: blade create k8s container-process
---

# 模拟容器内进程场景

## 介绍
kubernetes 下 容器内进程场景，同基础资源的进程场景

## 命令
支持的进程场景命令如下：
* `blade create k8s container-process kill` 杀容器内指定进程，同 [blade create process kill](../../host/process/blade_create_process_kill.md)
* `blade create k8s container-process stop` 挂起容器内指定进程，同 [blade create process stop](../../host/process/blade_create_process_stop.md)

## 参数
除了上述基础场景各自所需的参数外，在 kubernetes 环境下，还支持的参数如下：
```
--container-ids string     容器ID，支持配置多个
--container-names string   容器名称，支持配置多个
--docker-endpoint string   Docker server 地址，默认为本地的 /var/run/docker.sock
--namespace string       Pod 所属的命名空间，只能填写一个值，必填项
--evict-count string     限制实验生效的数量
--evict-percent string   限制实验生效数量的百分比，不包含 %
--labels string          Pod 资源标签，多个标签之前是或的关系
--names string           Pod 资源名
--kubeconfig string      kubeconfig 文件全路径（仅限使用 blade 命令调用时使用）
--waiting-time string    实验结果等待时间，默认为 20s，参数值要包含单位，例如 10s，1m
```

## 案例
指定 default 命名空间下 Pod 名是 frontend-d89756ff7-tl4xl，容器id为 f1de335b4eeaf，进程名为 top 的进程。

**yaml 配置方式** 
```yaml
apiVersion: chaosblade.io/v1alpha1
kind: ChaosBlade
metadata:
  name: kill-container-process-by-id
spec:
  experiments:
  - scope: container
    target: process
    action: kill
    desc: "kill container process by id"
    matchers:
    - name: container-ids
      value:
      - "f1de335b4eeaf"
    - name: process
      value: ["top"]
    - name: names
      value: ["frontend-d89756ff7-tl4xl"]
```
例如配置好文件后，保存为 kill_container_process_by_id.yaml ，使用以下命令执行实验场景：
 ```
 kubectl apply -f kill_container_process_by_id.yaml 
 ```
 可通过以下命令查看每个实验的执行状态：
 ```
 kubectl get blade kill-container-process-by-id -o json
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
        "name": "kill-container-process-by-id",
        "resourceVersion": "9438733",
        "selfLink": "/apis/chaosblade.io/v1alpha1/chaosblades/kill-container-process-by-id",
        "uid": "a5a597be-ff7e-11e9-a8e2-00163e08a39b"
    },
    "status": {
        "expStatuses": [
            {
                "action": "kill",
                "resStatuses": [
                    {
                        "id": "10cdc57b9c80a9f0",
                        "kind": "container",
                        "name": "php-redis",
                        "nodeName": "cn-hangzhou.192.168.0.204",
                        "state": "Success",
                        "success": true,
                        "uid": "f1de335b4eeaf035b8d23a87080f3d24cebc803cbb6ad15e5fe0d8567e2e8939"
                    }
                ],
                "scope": "container",
                "state": "Success",
                "success": true,
                "target": "process"
            }
        ],
        "phase": "Running"
    }
}
 ```
  
使用以下命令停止实验：
```
kubectl delete -f kill_container_process_by_id.yaml 
```

注意，停止实验不会恢复已杀掉的进程！！

**blade 命令执行方式**
```shell
blade create k8s container-process kill --process top --names frontend-d89756ff7-tl4xl --container-ids f1de335b4eeaf --namespace default --kubeconfig config
```
如果执行失败，会返回详细的错误信息；如果执行成功，会返回实验的 UID：
```
{"code":200,"success":true,"result":"06d5ebae60e8fe3f"}
```
可通过以下命令查询实验状态：
```
blade query k8s create 06d5ebae60e8fe3f --kubeconfig config

{"code":200,"success":true,"result":{"uid":"06d5ebae60e8fe3f","success":true,"error":"","statuses":[{"id":"1000cbd2018e2c90","uid":"f1de335b4eeaf035b8d23a87080f3d24cebc803cbb6ad15e5fe0d8567e2e8939","name":"php-redis","state":"Success","kind":"container","success":true,"nodeName":"cn-hangzhou.192.168.0.204"}]}}
```
销毁实验：
```
blade destroy 06d5ebae60e8fe3f
```

## 常见问题
Q: 如果状态如下：
```
"status": {
        "expStatuses": [
            {
                "action": "kill",
                "error": "see resStatus for the error details",
                "resStatuses": [
                    {
                        "kind": "container",
                        "name": "slave",
                        "nodeName": "cn-hangzhou.192.168.0.204",
                        "state": "Error",
                        "success": false,
                        "uid": "c3175f916e87fe06c339712427758f3d51dcb38d3e71cfae168bbbdfeab86710"
                    }
                ],
                "scope": "container",
                "state": "Error",
                "success": false,
                "target": "process"
            }
        ],
        "phase": "Error"
    }
```
A: 其实已经执行，只是返回结果有乱码；删除实验，重新执行实验即可

Q: 
```
"status": {
        "expStatuses": [
            {
                "action": "kill",
                "error": "the resources not found",
                "scope": "container",
                "state": "Error",
                "success": false,
                "target": "process"
            }
        ],
        "phase": "Error"
    }
```
A: container 没有找到

Q: 
```
"status": {
        "expStatuses": [
            {
                "action": "kill",
                "error": "see resStatus for the error details",
                "resStatuses": [
                    {
                        "error": "top process not found exit status 1",
                        "kind": "container",
                        "name": "php-redis",
                        "nodeName": "cn-hangzhou.192.168.0.204",
                        "state": "Error",
                        "success": false,
                        "uid": "f1de335b4eeaf035b8d23a87080f3d24cebc803cbb6ad15e5fe0d8567e2e8939"
                    }
                ],
                "scope": "container",
                "state": "Error",
                "success": false,
                "target": "process"
            }
        ],
        "phase": "Error"
    }
```
A：目标进程找不到

其他问题参考 [blade create k8s](blade create k8s.md) 常见问题