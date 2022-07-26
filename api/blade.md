---
title: blade
---

chaosblade cli exec command

## Introduce

chaosblade is an easy-to-use and powerful chaos experiment implementation tool, welcome to use and build

## Example

```text
# Check out the blade command help documentation
blade -h

# All commands can add the -h parameter to see how this command is used, such as creating chaos experiments
blade create -h

# All commands can add the -d parameter to see detail exec info
blade create cpu fullload -d
```

## Parameter

```text
-d, --debug Set the tool to DEBUG mode, mainly used for debugging
-h, --help  Check out the blade command help documentation
```

## Related Commands

* [blade create](blade create.md)     - Create a Chaos Experiment
* blade_destroy.md  - Destroy a Chaos Experiment
* blade_prepare.md  - Prepare the chaos experiment environment, which must be performed before some experiments are performed
* blade_revoke.md   - Revoke the chaos experiment environment, corresponding to the prepare operation
* [blade status](blade status.md)   - Query Chaos Experiment and Chaos Experiment Environment Status
* blade_query.md    - Query the system parameters required for some experiments
* [blade version](blade version.md)  - Print blade tool version information
* [blade server](blade server.md)     - Server mode
