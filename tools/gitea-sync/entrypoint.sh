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
SYNC_OWNER_UID="${SYNC_OWNER_UID:-}"
SYNC_OWNER_GID="${SYNC_OWNER_GID:-}"
SYNC_RUNTIME_HOME="${SYNC_RUNTIME_HOME:-/tmp/gitea-sync-home}"

shutdown_requested=0

on_shutdown() {
  shutdown_requested=1
}

trap on_shutdown INT TERM

validate_sync_owner() {
  if [[ -z "${SYNC_OWNER_UID}" && -z "${SYNC_OWNER_GID}" ]]; then
    return 0
  fi

  if [[ -z "${SYNC_OWNER_UID}" || -z "${SYNC_OWNER_GID}" ]]; then
    echo "[gitea-sync] ERROR: SYNC_OWNER_UID and SYNC_OWNER_GID must either both be set or both be empty" >&2
    exit 1
  fi

  if ! [[ "${SYNC_OWNER_UID}" =~ ^[0-9]+$ && "${SYNC_OWNER_GID}" =~ ^[0-9]+$ ]]; then
    echo "[gitea-sync] ERROR: SYNC_OWNER_UID and SYNC_OWNER_GID must both be integers" >&2
    exit 1
  fi
}

sync_checkout_owner() {
  if [[ -z "${SYNC_OWNER_UID}" && -z "${SYNC_OWNER_GID}" ]]; then
    return 0
  fi

  if [[ -e "${CHECKOUT_DIR}" ]]; then
    chown -R "${SYNC_OWNER_UID}:${SYNC_OWNER_GID}" "${CHECKOUT_DIR}"
  fi
}

prepare_sync_runtime() {
  local checkout_parent

  mkdir -p "${SYNC_ROOT}"

  if [[ -z "${SYNC_OWNER_UID}" && -z "${SYNC_OWNER_GID}" ]]; then
    return 0
  fi

  checkout_parent="$(dirname "${CHECKOUT_DIR}")"
  if [[ "${checkout_parent}" != "/" ]]; then
    mkdir -p "${checkout_parent}"
    chown "${SYNC_OWNER_UID}:${SYNC_OWNER_GID}" "${checkout_parent}"
  fi

  mkdir -p "${SYNC_RUNTIME_HOME}"
  chown -R "${SYNC_OWNER_UID}:${SYNC_OWNER_GID}" "${SYNC_ROOT}" "${SYNC_RUNTIME_HOME}"
}

run_as_sync_owner() {
  if [[ -z "${SYNC_OWNER_UID}" && -z "${SYNC_OWNER_GID}" ]]; then
    "$@"
    return
  fi

  HOME="${SYNC_RUNTIME_HOME}" \
  USER="sync" \
  LOGNAME="sync" \
  XDG_CONFIG_HOME="${SYNC_RUNTIME_HOME}/.config" \
    setpriv \
      --reuid "${SYNC_OWNER_UID}" \
      --regid "${SYNC_OWNER_GID}" \
      --clear-groups \
      "$@"
}

validate_sync_owner

if ! [[ "${SYNC_INTERVAL_SECONDS}" =~ ^[0-9]+$ ]]; then
  echo "[gitea-sync] ERROR: SYNC_INTERVAL_SECONDS must be an integer, got '${SYNC_INTERVAL_SECONDS}'" >&2
  exit 1
fi

prepare_sync_runtime

if [[ -n "${SYNC_OWNER_UID}" && -n "${SYNC_OWNER_GID}" ]]; then
  log "Preparing repository '${REPO_NAME}' in '${CHECKOUT_DIR}' as ${SYNC_OWNER_UID}:${SYNC_OWNER_GID}"
else
  log "Preparing repository '${REPO_NAME}' in '${CHECKOUT_DIR}'"
fi

sync_checkout_owner
run_as_sync_owner "${CLONE_SCRIPT}" "${REPO_NAME}" "${CHECKOUT_DIR}"
sync_checkout_owner

if [[ ! -d "${CHECKOUT_DIR}/.git" ]]; then
  echo "[gitea-sync] ERROR: expected a git repository at '${CHECKOUT_DIR}' after clone" >&2
  exit 1
fi

log "Starting sync loop with ${SYNC_INTERVAL_SECONDS}s interval"

while [[ "${shutdown_requested}" -eq 0 ]]; do
  before_head="$(run_as_sync_owner git -C "${CHECKOUT_DIR}" rev-parse HEAD 2>/dev/null || true)"
  current_branch="$(run_as_sync_owner git -C "${CHECKOUT_DIR}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  sync_ref=""

  if [[ -z "${current_branch}" ]]; then
    log "Detached HEAD or no local branch checked out; will retry"
  elif ! run_as_sync_owner git -C "${CHECKOUT_DIR}" fetch --prune --quiet origin; then
    log "git fetch --prune failed; will retry"
  else
    upstream_ref="$(run_as_sync_owner git -C "${CHECKOUT_DIR}" rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"

    if [[ -n "${upstream_ref}" ]]; then
      sync_ref="${upstream_ref}"
    elif run_as_sync_owner git -C "${CHECKOUT_DIR}" show-ref --verify --quiet "refs/remotes/origin/${current_branch}"; then
      sync_ref="origin/${current_branch}"
    fi
  fi

  if [[ -n "${current_branch}" && -z "${sync_ref}" ]]; then
    log "No upstream or origin/${current_branch} found for checked out branch; will retry"
  elif [[ -n "${sync_ref}" ]] && ! run_as_sync_owner git -C "${CHECKOUT_DIR}" merge --ff-only --quiet "${sync_ref}"; then
    log "git merge --ff-only failed; will retry"
  elif [[ -n "${sync_ref}" ]]; then
    after_head="$(run_as_sync_owner git -C "${CHECKOUT_DIR}" rev-parse HEAD 2>/dev/null || true)"
    if [[ "${before_head}" != "${after_head}" ]]; then
      log "Repository advanced to ${after_head}"
      sync_checkout_owner
    fi
  fi

  sleep "${SYNC_INTERVAL_SECONDS}" &
  wait $! || true
done

log "Shutdown requested; exiting"
