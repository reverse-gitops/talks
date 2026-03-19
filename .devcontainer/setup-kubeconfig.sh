#!/usr/bin/env bash

set -euo pipefail

log() { echo "[setup-kubeconfig] $*"; }
fail() { echo "[setup-kubeconfig] ERROR: $*" >&2; exit 1; }

CLUSTER_NAME="${1:-gitops-reverser-test-e2e}"

log "Fetching kubeconfig for cluster '${CLUSTER_NAME}'"
k3d kubeconfig get "${CLUSTER_NAME}" > ~/.kube/config

rewrite_kubeconfig_for_devcontainer() {
  local cluster_entry server host port

  cluster_entry="$(kubectl config view --minify -o jsonpath='{.clusters[0].name}')"
  server="$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')"

  if [[ "$server" =~ ^https://([^:/]+):([0-9]+)$ ]]; then
    host="${BASH_REMATCH[1]}"
    port="${BASH_REMATCH[2]}"
  else
    log "kubeconfig server is '${server}' (couldn't parse host/port; no rewrite)"
    return 0
  fi

  if getent hosts host.docker.internal >/dev/null 2>&1; then
    if [[ "$host" == "0.0.0.0" || "$host" == "127.0.0.1" || "$host" == "localhost" ]]; then
      log "Rewriting kubeconfig server endpoint to host.docker.internal:${port}..."
      kubectl config set-cluster "$cluster_entry" \
        --server="https://host.docker.internal:${port}" \
        --tls-server-name=localhost >/dev/null
      log "kubeconfig endpoint updated for devcontainer networking"
    else
      log "kubeconfig server host is '${host}' (no rewrite needed)"
    fi
  else
    log "host.docker.internal not resolvable; keeping server as ${server}"
  fi
}

rewrite_kubeconfig_for_devcontainer

log "Testing connection..."
kubectl get nodes
log "Done — kubectl is ready"
