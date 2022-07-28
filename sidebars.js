module.exports = {
    "docs": {
      "Getting Started": [
        "getting-started/introduce",
        "getting-started/quick-start"
      ],
      "Community": [
        "community/docs",
        "community/PR-guide",
        "community/dev-standard",
        "community/issue-standard",
      ],
      "Types of Chaos Experiments": [
        {
          "Physical Host":[
            "experiment-types/host/blade create cpu load",
            "experiment-types/host/blade create disk burn",
            "experiment-types/host/blade create disk fill",
            "experiment-types/host/blade create network delay",
            "experiment-types/host/blade create network dns",
            "experiment-types/host/blade create network drop",
            "experiment-types/host/blade create network loss",
            "experiment-types/host/blade create network corrupt",
            "experiment-types/host/blade create network reorder",
            "experiment-types/host/blade create network duplicate",
            "experiment-types/host/blade create network occupy",
            "experiment-types/host/blade create process kill",
            "experiment-types/host/blade create process stop",
          ]
        },
        {
          "Kubernetes": [
            "experiment-types/k8s/blade create k8s",
            "experiment-types/k8s/blade create k8s node-cpu",
            "experiment-types/k8s/blade create k8s node-network",
            "experiment-types/k8s/blade create k8s node-process",
            "experiment-types/k8s/blade create k8s node-disk",
            "experiment-types/k8s/blade create k8s pod-pod",
            "experiment-types/k8s/blade create k8s pod-IO",
            "experiment-types/k8s/blade create k8s pod-network",
            "experiment-types/k8s/blade create k8s container-cpu",
            "experiment-types/k8s/blade create k8s container-network",
            "experiment-types/k8s/blade create k8s container-process",
            "experiment-types/k8s/blade create k8s container-container",
          ]
        }
      ]
    }
  }
  