---
id: blade create script delay
---

# Simulating the delay of script function execution

## Introduction

An experiment that simulates the delay of script function execution will be performed after specifying the script and its function.

## CLI Command

* `blade create script delay -h`

## Parameter

| Name            | Introduction                | Type   | Required | Example Value |
|-----------------|-----------------------------|--------|----------|---------------|
| `time`          | Time of delay(ms)           | int    | `Y`      | `10000`       |
| `file`          | Path to the script          | string | `Y`      | `test.sh`     |
| `function-name` | Function name in the script | string | `Y`      | `start0`      |
| `timeout`       | Running time(s)             | int    | `N`      | `30`          |

## Case

```text
# blade create script delay --time 10000 --file test.sh --function-name start0
{"code":200,"success":true,"result":"b6a0f477b7fb1f4c"}

# The sleep command will be added to the script:
start0() {
    sleep 10.000000
    ...
}
```

## Principle

After backing up the original script, the `sleep` command will be added to the function by the function name. Finally, the original script will be restored after the experiment is destroyed.

## Q&A
Q: {"code":602,"success":false,"error":"get too many lines by the install function name"}

A：Execution failed because multiple functions were found.
