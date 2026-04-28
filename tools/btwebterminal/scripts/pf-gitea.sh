#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: pf-gitea.sh

Starts or reuses a persistent kubectl port-forward to the configured Gitea
service using the same settings as clone-gitea-repo.sh.

Defaults:
  GITEA_NAMESPACE=gitea-e2e
  GITEA_SERVICE=gitea-http
  GITEA_LOCAL_PORT=13000

Optional environment variables:
  KUBECTL_CONTEXT         kubeconfig context to use
EOF
}

require_cmd() {
  local cmd="$1"
  command -v "${cmd}" >/dev/null 2>&1 || {
    echo "ERROR: required command not found: ${cmd}" >&2
    exit 1
  }
}

for cmd in kubectl curl nohup; do
  require_cmd "${cmd}"
done

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

GITEA_NAMESPACE="${GITEA_NAMESPACE:-gitea-e2e}"
GITEA_SERVICE="${GITEA_SERVICE:-gitea-http}"
GITEA_LOCAL_PORT="${GITEA_LOCAL_PORT:-13000}"
KUBECTL_CONTEXT="${KUBECTL_CONTEXT:-}"

PORT_FORWARD_PID_FILE="${TMPDIR:-/tmp}/gitea-port-forward-${GITEA_NAMESPACE}-${GITEA_SERVICE}-${GITEA_LOCAL_PORT}.pid"
PORT_FORWARD_LOG_FILE="${TMPDIR:-/tmp}/gitea-port-forward-${GITEA_NAMESPACE}-${GITEA_SERVICE}-${GITEA_LOCAL_PORT}.log"

kubectl_cmd() {
  if [[ -n "${KUBECTL_CONTEXT}" ]]; then
    kubectl --context "${KUBECTL_CONTEXT}" "$@"
  else
    kubectl "$@"
  fi
}

gitea_api_url() {
  printf 'http://127.0.0.1:%s/api/v1' "${GITEA_LOCAL_PORT}"
}

api_ready() {
  curl -fsS "$(gitea_api_url)/version" >/dev/null 2>&1
}

discover_service_port() {
  local service_port

  service_port="$(
    kubectl_cmd -n "${GITEA_NAMESPACE}" get svc "${GITEA_SERVICE}" \
      -o go-template='{{range .spec.ports}}{{if eq .name "http"}}{{.port}}{{"\n"}}{{end}}{{end}}' 2>/dev/null \
      | head -n1
  )"

  if [[ -z "${service_port}" ]]; then
    service_port="$(
      kubectl_cmd -n "${GITEA_NAMESPACE}" get svc "${GITEA_SERVICE}" \
        -o go-template='{{(index .spec.ports 0).port}}' 2>/dev/null
    )"
  fi

  if [[ -z "${service_port}" ]]; then
    echo "ERROR: could not determine service port for ${GITEA_NAMESPACE}/${GITEA_SERVICE}" >&2
    exit 1
  fi

  printf '%s' "${service_port}"
}

ensure_port_forward() {
  local service_port existing_pid

  if api_ready; then
    return 0
  fi

  if [[ -f "${PORT_FORWARD_PID_FILE}" ]]; then
    existing_pid="$(tr -d '\n\r' < "${PORT_FORWARD_PID_FILE}" || true)"
    if [[ -n "${existing_pid}" ]] && kill -0 "${existing_pid}" 2>/dev/null; then
      for _ in {1..15}; do
        if api_ready; then
          return 0
        fi
        sleep 1
      done
    fi
    rm -f "${PORT_FORWARD_PID_FILE}"
  fi

  service_port="$(discover_service_port)"

  echo "Starting persistent port-forward: ${GITEA_NAMESPACE}/${GITEA_SERVICE} ${GITEA_LOCAL_PORT}:${service_port}"
  local kubectl_args=()
  if [[ -n "${KUBECTL_CONTEXT}" ]]; then
    kubectl_args=(--context "${KUBECTL_CONTEXT}")
  fi
  nohup kubectl "${kubectl_args[@]}" -n "${GITEA_NAMESPACE}" port-forward --address 127.0.0.1 \
    "svc/${GITEA_SERVICE}" "${GITEA_LOCAL_PORT}:${service_port}" \
    >"${PORT_FORWARD_LOG_FILE}" 2>&1 &
  echo $! > "${PORT_FORWARD_PID_FILE}"

  for _ in {1..30}; do
    if api_ready; then
      return 0
    fi
    sleep 1
  done

  echo "ERROR: Gitea API did not become reachable at $(gitea_api_url)" >&2
  echo "Port-forward log: ${PORT_FORWARD_LOG_FILE}" >&2
  exit 1
}

ensure_port_forward

cat <<EOF
Gitea port-forward ready.
  namespace: ${GITEA_NAMESPACE}
  service: ${GITEA_SERVICE}
  local api: $(gitea_api_url)
  pid file: ${PORT_FORWARD_PID_FILE}
  log file: ${PORT_FORWARD_LOG_FILE}
EOF
