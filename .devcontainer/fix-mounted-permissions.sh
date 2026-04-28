#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[fix-mounted-permissions] $*"
}

run_as_root() {
  if command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    "$@"
  fi
}

ensure_shared_writable_dir() {
  local target_dir="$1"
  local uid gid

  [[ -e "${target_dir}" ]] || return 0

  uid="$(id -u)"
  gid="$(id -g)"

  log "Ensuring ${target_dir} is writable for ${uid}:${gid}"
  run_as_root chown -R "${uid}:${gid}" "${target_dir}"
  run_as_root chmod -R ug+rwX "${target_dir}"
  # Keep directories in a shared-writable state so newly created files inherit the same group.
  run_as_root find "${target_dir}" -type d -exec chmod g+s {} +
}

workspace_dir="${1:-${containerWorkspaceFolder:-${WORKSPACE_FOLDER:-$(pwd)}}}"
demo_repo_dir="${workspace_dir}/the-gitops-paradox/demo-repo"

ensure_shared_writable_dir "${demo_repo_dir}"
