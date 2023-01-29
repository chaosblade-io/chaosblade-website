---
id: blade create script exit
---

# Simulating the exit of script function execution

## Introduction

An experiment that simulates the exit of script function execution will be performed after specifying the script and its function.

## CLI Command

* `blade create script exit -h`

## Parameter

| Name            | Introduction                | Type   | Required | Example Value           |
|-----------------|-----------------------------|--------|----------|-------------------------|
| `exit-code`     | Exit code(Default value: 1) | int    | `N`      | `1`                     |
| `exit-message`  | Exit message                | string | `N`      | `this-is-error-message` |
| `file`          | Path to the script          | string | `Y`      | `test.sh`               |
| `function-name` | Function name in the script | string | `Y`      | `start0`                |
| `timeout`       | Running time(s)             | int    | `N`      | `20`                    |

## Case

```text
# blade create script exit --exit-code 1 --exit-message this-is-error-message --file test.sh --function-name start0
{"code":200,"success":true,"result":"d8a016b96380d7f3"}

# The echo and exit commands will be added to the script:
start0() {
    echo this-is-error-message;exit 1
    ...
}
```

## Principle

After backing up the original script, the `echo` and `exit` commands will be added to the function by the function name. Finally, the original script will be restored after the experiment is destroyed.

## Q&A
Q: {"code":602,"success":false,"error":"get too many lines by the install function name"} 

A：Execution failed because multiple functions were found.
