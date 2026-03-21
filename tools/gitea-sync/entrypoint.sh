#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[gitea-sync] $*"
}

REPO_NAME="${REPO_NAME:-demo}"
SYNC_ROOT="${SYNC_ROOT:-/sync}"
SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS:-3}"
CHECKOUT_DIR="${CHECKOUT_DIR:-${SYNC_ROOT}/${REPO_NAME}}"
CLONE_SCRIPT="${CLONE_SCRIPT:-/usr/local/bin/clone-gitea-repo.sh}"

shutdown_requested=0

on_shutdown() {
  shutdown_requested=1
}

trap on_shutdown INT TERM

if ! [[ "${SYNC_INTERVAL_SECONDS}" =~ ^[0-9]+$ ]]; then
  echo "[gitea-sync] ERROR: SYNC_INTERVAL_SECONDS must be an integer, got '${SYNC_INTERVAL_SECONDS}'" >&2
  exit 1
fi

mkdir -p "${SYNC_ROOT}"

log "Preparing repository '${REPO_NAME}' in '${CHECKOUT_DIR}'"
"${CLONE_SCRIPT}" "${REPO_NAME}" "${CHECKOUT_DIR}"

if [[ ! -d "${CHECKOUT_DIR}/.git" ]]; then
  echo "[gitea-sync] ERROR: expected a git repository at '${CHECKOUT_DIR}' after clone" >&2
  exit 1
fi

log "Starting sync loop with ${SYNC_INTERVAL_SECONDS}s interval"

while [[ "${shutdown_requested}" -eq 0 ]]; do
  if ! git -C "${CHECKOUT_DIR}" pull --ff-only --quiet; then
    log "git pull failed; will retry"
  fi

  sleep "${SYNC_INTERVAL_SECONDS}" &
  wait $! || true
done

log "Shutdown requested; exiting"
