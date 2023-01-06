# 基础资源场景扩展开发文档

[chaosblade-exec-os](https://github.com/chaosblade-io/chaosblade-exec-os) 是基础资源场景项目，例如 CPU、内存、进程、网络、磁盘等系统资源基础场景。本文从项目工程、执行流程、场景扩展、打包测试四个方面详细介绍基础资源场景扩展。

# 项目工程

![image](/img/doc-image/os-dev-guide/90ef69c6-6c2f-4989-ba8b-1be56686372b.png)

该项目核心代码包含四部分：

1.  build 是跨平台打包目录

2.  exec 是各场景实现代码

3.  extra 是依赖的第三方工具

4.  main.go 是场景执行入口


# 执行流程

![image](/img/doc-image/os-dev-guide/aed33af9-3670-4428-9a41-e67676247303.png)

1.  通过 blade执行基础资源场景会调用 bin/chaos\_os执行

2.  bin/chaos\_os会解析命令参数，识别是创建实验还是销毁实验

3.  将实验参数转换为实验对象

4.  调用对应的实验执行器执行


# 场景扩展

本文以新增 Linux 系统关机、断电、重启这三个场景举例，详细介绍如何在 chaosblade-exec-os 项目中扩展系统场景。

## 场景实现设计

经调研，在 Linux 中可通过 shutdown 指令对主机进行关机（halt）、断电（power-off）和重启（reboot）操作，通过 shutdown 指令帮助文档可以查看指令详情，相关指令如下：

    # 系统1分钟后关机, 不添加时间默认是 1 分钟后执行
    shutdown -H
    
    # 系统立即断电
    shutdown -P now
    
    # 系统2分钟后强制重启
    shutdown -r -f +2
    
    # 取消 shutdown 指令
    shutdown -c

与 ChaosBlade 混沌工程实验模型进行映射，可以将 shutdown作为 target，halt、poweroff、reboot分别作为 action，支持强制操作 force、设定时间time参数设置。注意，为更适合用户使用，需要对time参数做修改，如不填写此参数，则表示立即执行，则默认值改为now。则使用 chaosblade 执行如下：

    # 系统1分钟后关机, 不添加时间默认是立即执行
    blade create shutdown halt --time 1
    
    # 系统立即断电
    blade create shutdown poweroff --force
    
    # 系统2分钟后强制重启
    blade create shutdown reboot --time 2
    
    # 取消 shutdown 实验
    blade destroy UID

## 场景代码实现

### 案例参考

此次扩展的故障场景类似于进程故障场景，如杀进程、进程停止，可以参考进程场景实现。

![image](/img/doc-image/os-dev-guide/9f6ac3fe-5c55-42b0-874b-1d44b05e36e8.png)

通过已有进程场景代码可以看出，在 exec目录下，创建 process目录来定义 target是 process的故障场景模型定义 ProcessCommandModelSpec，在此模型中分别定义杀进程kill场景和停止进程stop场景实验action模型 NewXXXProcessActionCommandSpec，每个场景在分别在process\_kill和 process\_stop中定义。

以KillProcessActionCommandSpec为例，主要根据 BaseExpActionCommandSpec需要定义以下内容：

    // 故障场景匹配条件
    	ActionMatchers    []ExpFlagSpec
    // 故障相关参数
    	ActionFlags       []ExpFlagSpec
    // 故障场景执行器
    	ActionExecutor    Executor
    // 故障场景长描述
    	ActionLongDesc    string
    // 故障场景使用案例
    	ActionExample     string
    // 故障场景执行所使用的执行程序
    	ActionPrograms    []string
    // 故障场景目录
    	ActionCategories  []string
    // 故障场景是否daemon持久运行
    	ActionProcessHang bool

下文将从创建 Shutdown 故障实验命令，到实现重启实验场景，再到实现关机实验场景，抽离相同实现，再到扩展断电实验场景进行详细介绍。

### 创建 shutdown 故障命令

在 exec目录创建 shutdown目录来存放场景相关代码，并创建shutdown.go文件定义实验场景模型。

    package shutdown
    
    import (
    	"github.com/chaosblade-io/chaosblade-spec-go/spec"
    )
    
    type ShutdownCommandModelSpec struct {
    	spec.BaseExpModelCommandSpec
    }
    
    func NewShutdownCommandModelSpec() spec.ExpModelCommandSpec {
    	return &ShutdownCommandModelSpec{
    		spec.BaseExpModelCommandSpec{
    			ExpActions: []spec.ExpActionCommandSpec{
    				// 重启、关机、断电实现
    			},
    			ExpFlags: []spec.ExpFlagSpec{
    				// 通用参数
    			},
    		},
    	}
    }
    
    func (s ShutdownCommandModelSpec) Name() string {
    	return "shutdown"
    }
    
    func (s ShutdownCommandModelSpec) ShortDesc() string {
    	return "Support shutdown, halt or reboot experiment."
    }
    
    func (s ShutdownCommandModelSpec) LongDesc() string {
    	return "Support shutdown, halt or reboot experiment. Can control shutdown or restart behavior with different flags. Warning! the experiment cannot be recovered by this tool."
    }

下面需要再ExpActions创建重启、关机、断电相关场景实现，接下来以实现重启场景举例

### 实现重启场景

创建 shutdown\_reboot.go文件，遵循 spec.ExpActionCommandSpec定义 RebootActionCommandSpec实现。

    type RebootActionCommandSpec struct {
    	spec.BaseExpActionCommandSpec
    }
    
    func NewRebootActionCommandSpec() spec.ExpActionCommandSpec {
    	return &RebootActionCommandSpec{
    		spec.BaseExpActionCommandSpec{
    			ActionMatchers: []spec.ExpFlagSpec{},
    			ActionFlags:    []spec.ExpFlagSpec{},
    			ActionExecutor: &RebootExecutor{},
    			ActionExample: `
    # Force to reboot machine
    blade c shutdown reboot --force
    
    # Reboot machine after 1 minute
    blade c shutdown reboot --time 1`,
    			ActionPrograms:    []string{},
    			ActionCategories:  []string{},
    			ActionProcessHang: true,
    		},
    	}
    }
    
    func (r *RebootActionCommandSpec) Name() string {
    	return "reboot"
    }
    
    func (r *RebootActionCommandSpec) Aliases() []string {
    	return []string{"s"}
    }
    
    func (r *RebootActionCommandSpec) ShortDesc() string {
    	return "Reboot machine"
    }
    
    func (r *RebootActionCommandSpec) LongDesc() string {
    	return "Reboot machine. Warning! the experiment cannot be recovered by this tool."
    }
    
    type RebootExecutor struct {
    	channel spec.Channel
    }
    
    func (r *RebootExecutor) Name() string {
    	return "reboot"
    }
    
    func (r *RebootExecutor) Exec(uid string, ctx context.Context, model *spec.ExpModel) *spec.Response {
    	// TODO 重启具体实现
    	return nil
    }
    
    func (r *RebootExecutor) SetChannel(channel spec.Channel) {
    	r.channel = channel
    }

根据在上述场景设计部分，使用系统 shutdown命令来实现机器重启操作，并且支持时间和强制执行参数。则在 Exec函数中编码实现。

    func (r *RebootExecutor) Exec(uid string, ctx context.Context, model *spec.ExpModel) *spec.Response {
    	// Use it to identify operation
      if _, ok := spec.IsDestroy(ctx); ok {
    		return cancel(ctx, uid, model, r.channel)
    	}
    	return execute(ctx, model, "-r", r.channel)
    }
    
    // Execute shutdown command 
    func execute(ctx context.Context, model *spec.ExpModel, command string, channel spec.Channel) *spec.Response {
    	response := checkShutdownCommand(channel)
    	if !response.Success {
    		return response
    	}
    	force := model.ActionFlags[Force.Name] == "true"
    	time := model.ActionFlags[Time.Name]
    	if time == "" {
    		time = "now"
    	}
    	command = fmt.Sprintf("%s %s", ShutdownCommand, command)
    	if force {
    		command = fmt.Sprintf("%s -f", command)
    	}
    	command = fmt.Sprintf("sleep %d && %s %s", SleepTime, command, time)
    	shutdownErrLog := util.GetNohupOutput(util.Bin, stderrLog)
    	//  nohup bash -c "sleep 3 && shutdown -k" < /dev/null >/dev/null 2> shutdown.err &
    	command = fmt.Sprintf("bash -c '%s' < /dev/null > /dev/null 2> %s", command, shutdownErrLog)
    	return channel.Run(ctx, "nohup", command)
    }
    
    // Cancel shutdown
    func cancel(ctx context.Context, uid string, model *spec.ExpModel, channel spec.Channel) *spec.Response {
    	time := model.ActionFlags[Time.Name]
    	if time == "" || time == "now" || time == "+0" {
    		return spec.ReturnSuccess(uid)
    	}
    	// Calling the cancel command directly will not process the execution result.
    	// Because the return may fail due to downtime, it returns success directly.
    	response := channel.Run(ctx, ShutdownCommand, "-c")
    	if !response.Success {
    		logrus.Warningf("uid: %s, shutdown cancel failed, %v", uid, response.Error())
    	}
    	// Not bug.
    	return spec.ReturnSuccess(uid)
    }

重启场景实现完成后，可在shutdown命令中追加此场景：

    func NewShutdownCommandModelSpec() spec.ExpModelCommandSpec {
    	return &ShutdownCommandModelSpec{
    		spec.BaseExpModelCommandSpec{
    			ExpActions: []spec.ExpActionCommandSpec{
    				NewRebootActionCommandSpec(),
    			},
    			ExpFlags: []spec.ExpFlagSpec{
    				&Time, &Force,
    			},
    		},
    	}
    }

同样可以按此方式追加关机实现 shutdown\_halt.go和断电shutdown\_poweroff.go实现。由于 shutdown命令通过参数控制关机、断电、重启操作，所以可以将通用的代码可以提取到shutdown.go文件中，其他场景文件调用此文件中函数调用即可。最终代码如下：

![image](/img/doc-image/os-dev-guide/b183f750-a3d9-4063-b1c3-c1b1520a3184.png)

shutdown\_halt.go实现代码：

    func (h *HaltExecutor) Exec(uid string, ctx context.Context, model *spec.ExpModel) *spec.Response {
    	if _, ok := spec.IsDestroy(ctx); ok {
    		return cancel(ctx, uid, model, h.channel)
    	}
    	return execute(ctx, model, "-H", h.channel)
    }

shutdown\_poweroff.go实现代码：

    func (p *PowerOffExecutor) Exec(uid string, ctx context.Context, model *spec.ExpModel) *spec.Response {
    	if _, ok := spec.IsDestroy(ctx); ok {
    		return cancel(ctx, uid, model, p.channel)
    	}
    	return execute(ctx, model, "-P", p.channel)
    }

shutdown\_reboot.go实现代码：

    func (r *RebootExecutor) Exec(uid string, ctx context.Context, model *spec.ExpModel) *spec.Response {
    	if _, ok := spec.IsDestroy(ctx); ok {
    		return cancel(ctx, uid, model, r.channel)
    	}
    	return execute(ctx, model, "-r", r.channel)
    }

到此关于 shutdown 说涉及到的关机、断电、重启实验场景已经实现完毕，注册到model\_linux.go实验列表即可：

    func GetAllExpModels() []spec.ExpModelCommandSpec {
    	return []spec.ExpModelCommandSpec{
    		cpu.NewCpuCommandModelSpec(),
    		mem.NewMemCommandModelSpec(),
    		process.NewProcessCommandModelSpec(),
    		network.NewNetworkCommandSpec(),
    		disk.NewDiskCommandSpec(),
    		script.NewScriptCommandModelSpec(),
    		file.NewFileCommandSpec(),
    		kernel.NewKernelInjectCommandSpec(),
    		systemd.NewSystemdCommandModelSpec(),
    		stressng.NewStressModelSpec(),
    		time.NewTimeCommandSpec(),
        // shutdown
    		shutdown.NewShutdownCommandModelSpec(),
    	}
    }

# 打包测试

在项目根目录下使用 make build进行编译，编译后会在 target/chaosblade-VERSION/bin生成 chaos\_os和在 target/chaosblade-VERSION/yaml下生成 chaosblade-os-spec-XXX.yaml文件，在此文件中会有 shutdown场景声明：

    - target: shutdown
      shortDesc: Support shutdown, halt or reboot experiment.
      longDesc: Support shutdown, halt or reboot experiment. Can control shutdown or restart
        behavior with different flags. Warning! the experiment cannot be recovered by
        this tool.
      actions:
      - action: halt
        aliases: [h]
        shortDesc: Halt machine
        longDesc: Halt machine. Warning! the experiment cannot be recovered by this tool.
        flags:
        - name: time
          desc: waiting time, unit is minute, for example +1 means after 1 minute to run
          noArgs: false
          required: false
          requiredWhenDestroyed: false
        - name: force
          desc: Force operation
          noArgs: true
          required: false
          requiredWhenDestroyed: false

# 测试

直接将上述编译后的文件替换原有 chaosblade工具包中对应文件后进行测试。

    ./blade c shutdown -h
    Support shutdown, halt or reboot experiment. Can control shutdown or restart behavior with different flags. Warning! the experiment cannot be recovered by this tool.
    
    Usage:
      blade create shutdown [flags]
      blade create shutdown [command]
    
    Available Commands:
      halt        Halt machine
      poweroff    Shutdown machine
      reboot      Reboot machine
    
    Flags:
      -h, --help   help for shutdown
    
    Global Flags:
      -a, --async             whether to create asynchronously, default is false
      -d, --debug             Set client to DEBUG mode
      -e, --endpoint string   the create result reporting address. It takes effect only when the async value is true and the value is not empty
      -n, --nohup             used to internal async create, no need to config
          --uid string        Set Uid for the experiment, adapt to docker and cri
    
    Use "blade create shutdown [command] --help" for more information about a command.