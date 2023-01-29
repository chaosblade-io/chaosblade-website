---
title: blade status
---

本文档主要介绍`blade status`命令使用
## Usage
查询混沌实验和混沌实验环境状态，可通过创建的混沌实验的 uid 或命令类型来查询混沌实验。 status 可以简写为 s，即 `blade status` 可以简写为 `blade s`。
```
Usage:
  blade status

Aliases:
  status, s
  
blade status [flags]
```
## Exec
进入解压包本地所放置的路径，可通过`blade status -h`查看支持命令和参数。
```
  --asc bool        默认值为 false，按 CreateTime 进行降序排序
  --limit string    查询实验数目限制，支持 OFFSET 子句，例如：limit 4,3 就表示从位置5开始，返回后3项
  --status string   实验状态，create 类型支持 Created|Success|Error|Destroyed 状态，prepare 类型支持 Created|Running|Error|Revoked 状态
  --target string   实验目标，例如：dubbo
  --type string     命令类型，attach|create|destroy|detach
  --uid string      prepare 或 experiment 的 uid
  -h, --help        查看 create 命令帮助

# 可使用的父命令参数
  -d, --debug   设置 DEBUG 执行模式
```
## Examples
```
# 查看 status 命令帮助文档
blade status -h

# 查询 uid 为 4c6b4a3fc313e1d4 的实验信息
blade status 4c6b4a3fc313e1d4
{
        "code": 200,
        "success": true,
        "result": {
            "Uid": "4c6b4a3fc313e1d4",
            "Command": "cpu",
            "SubCommand": "fullload",
            "Flag": " --cpu-percent=60",
            "Status": "Destroyed",
            "Error": "",
            "CreateTime": "2020-01-14T14:09:49.152708+08:00",
            "UpdateTime": "2020-01-14T14:10:45.605888+08:00"
        }
}

# 查询 create 类型命令的实验信息
blade status --type create
{
        "code": 200,
        "success": true,
        "result": [
            {
                "Uid": "4c6b4a3fc313e1d4",
                "Command": "cpu",
                "SubCommand": "fullload",
                "Flag": " --cpu-percent=60",
                "Status": "Destroyed",
                "Error": "",
                "CreateTime": "2020-01-14T14:09:49.152708+08:00",
                "UpdateTime": "2020-01-14T14:10:45.605888+08:00"
            }
        ]
}

# 查询 prepare 类型命令的实验信息
blade status --type prepare
{
        "code": 200,
        "success": true,
        "result": [
                {
                        "Uid": "e669d57f079a00cc",
                        "ProgramType": "jvm",
                        "Process": "dubbo.consumer",
                        "Port": "59688",
                        "Status": "Running",
                        "Error": "",
                        "CreateTime": "2019-03-29T16:19:37.284579975+08:00",
                        "UpdateTime": "2019-03-29T17:05:14.183382945+08:00"
                }
        ]
}
```
## Q&A

Q:{"code":406,"success":false,"error":"data not found"} 
A:查询的实验不存在，可能是数据文件 chaosblade.dat 丢失，这时如果需要停止实验，需要手工停止 blade 进程
