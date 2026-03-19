#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[post-create] $*"
}

fail() {
  echo "[post-create] ERROR: $*" >&2
  exit 1
}

# Resolve workspace path in a way that works both inside and outside
# VS Code-specific shell variable injection.
workspace_dir="${1:-${containerWorkspaceFolder:-${WORKSPACE_FOLDER:-$(pwd)}}}"
log "Using workspace directory: ${workspace_dir}"

# Keep ~/.gitconfig writable inside the container while still importing host settings.
if [ -f /home/node/.gitconfig-host ]; then
  log "Configuring git to include /home/node/.gitconfig-host"
  touch /home/node/.gitconfig
  if git config --global --get-all include.path | grep -Fxq "/home/node/.gitconfig-host"; then
    log "Host gitconfig include already present"
  else
    git config --global --add include.path /home/node/.gitconfig-host
    log "Added host gitconfig include"
  fi
fi

# Require basic Git identity information.
git_name="$(git config --global --includes --get user.name || true)"
git_email="$(git config --global --includes --get user.email || true)"
if [ -z "${git_name}" ] || [ -z "${git_email}" ]; then
  fail "Missing Git identity. Configure both user.name and user.email in your host ~/.gitconfig."
fi

# Install dependencies for each presentation that has a package.json
log "Installing presentation dependencies with npm"
find "${workspace_dir}" -maxdepth 2 -name "package.json" \
  ! -path "*/node_modules/*" \
  ! -path "*/tools/*/node_modules/*" \
  -exec dirname {} \; | while read -r dir; do
  log "Running npm install in ${dir}"
  (cd "${dir}" && npm install)
done

log "post-create completed"
