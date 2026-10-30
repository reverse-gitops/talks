#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[post-create] $*"
}

warn() {
  echo "[post-create] WARNING: $*" >&2
}

fail() {
  echo "[post-create] ERROR: $*" >&2
  exit 1
}

workspace_dir="${1:-${containerWorkspaceFolder:-${WORKSPACE_FOLDER:-$(pwd)}}}"
log "Using workspace directory: ${workspace_dir}"

# Git identity is personalization, not part of a usable environment, so a missing one is
# reported and setup continues. Configured Git config wins over the env variables.
git_name="$(git config --get user.name || true)"
git_email="$(git config --get user.email || true)"

if [ -z "${git_name}" ] && [ -n "${GIT_USER_NAME:-}" ]; then
  git_name="${GIT_USER_NAME}"
fi

if [ -z "${git_email}" ] && [ -n "${GIT_USER_EMAIL:-}" ]; then
  git_email="${GIT_USER_EMAIL}"
fi

if [ -n "${git_name}" ] && [ -z "$(git config --global --get user.name || true)" ]; then
  git config --global user.name "${git_name}"
fi

if [ -n "${git_email}" ] && [ -z "$(git config --global --get user.email || true)" ]; then
  git config --global user.email "${git_email}"
fi

if [ -z "${git_name}" ] || [ -z "${git_email}" ]; then
  warn "No Git identity yet. Set user.name and user.email, or provide GIT_USER_NAME and GIT_USER_EMAIL"
  warn "to the devcontainer environment. Commits need one; the rest of the environment does not."
fi

# Signing is not configured here: post-start.sh runs sync-signing-key.sh on every start,
# including the first one right after this hook, and that is where an SSH agent can be expected.

shared_home_dir="/home/node/shared"
fix_permissions_script="${workspace_dir}/.devcontainer/fix-mounted-permissions.sh"

# Persist the ~/.claude.json file by making it a symlink (this trick can be used for other potenial config file in the home folder as well)
if [ -L "${shared_home_dir}" ]; then
  rm -f "${shared_home_dir}"
fi
mkdir -p "${shared_home_dir}"
touch "${shared_home_dir}/.claude.json"
rm -f /home/node/.claude.json
ln -s "${shared_home_dir}/.claude.json" /home/node/.claude.json

log "Fixing dotkube volume permissions"
chmod -R a+r /home/node/.kube && find /home/node/.kube -type d -exec chmod a+x {} +

log "Fixing mounted repo volume permissions"
if [ -r "${fix_permissions_script}" ]; then
  # Run via bash so this still works when the bind-mounted workspace drops execute bits.
  bash "${fix_permissions_script}" "${workspace_dir}"
else
  fail "Missing or unreadable permissions helper: ${fix_permissions_script}"
fi

log "Installing npm dependencies via task"
task --dir "${workspace_dir}" install-node-deps

log "Installing Playwright Chromium browser"
(cd "${workspace_dir}/the-gitops-paradox" && npx playwright install chromium)

# Give marp-cli and mermaid-cli a stable path to that Chromium (CHROME_PATH and
# PUPPETEER_EXECUTABLE_PATH in devcontainer.json point here).
chrome_bin="$(ls -d /home/node/.cache/ms-playwright/chromium-*/chrome-linux*/chrome 2>/dev/null | sort -V | tail -n 1)"
if [ -n "${chrome_bin}" ]; then
  mkdir -p /home/node/.local/bin
  ln -sf "${chrome_bin}" /home/node/.local/bin/chrome
  log "Linked ${chrome_bin} to /home/node/.local/bin/chrome"
else
  warn "No Playwright Chromium found, marp and mmdc will not find a browser"
fi

log "Installing img2pdf (used by task export-pdf PNG pipeline)"
pip3 install --quiet --break-system-packages --no-warn-script-location img2pdf

log "post-create completed"
