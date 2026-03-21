#!/bin/bash

set -euo pipefail

echo "Starting Main Process ..."

APP_USER="${USER:-node}"
APP_HOME="${HOME:-/home/${APP_USER}}"
KUBE_DIR="${APP_HOME}/.kube"
SHARED_DIR="${APP_HOME}/shared"

sync_app_user_to_dir_owner() {
  local target_dir="$1"
  local current_uid current_gid target_uid target_gid existing_user existing_group
  local home_entry

  [[ -d "${target_dir}" ]] || return 0

  current_uid="$(id -u "${APP_USER}")"
  current_gid="$(id -g "${APP_USER}")"
  target_uid="$(stat -c '%u' "${target_dir}")"
  target_gid="$(stat -c '%g' "${target_dir}")"

  if [[ "${current_uid}" == "${target_uid}" && "${current_gid}" == "${target_gid}" ]]; then
    return 0
  fi

  existing_user="$(getent passwd "${target_uid}" | cut -d: -f1 || true)"
  existing_group="$(getent group "${target_gid}" | cut -d: -f1 || true)"

  if [[ -n "${existing_user}" && "${existing_user}" != "${APP_USER}" ]]; then
    echo "Cannot remap ${APP_USER} to UID ${target_uid}; already used by ${existing_user}" >&2
    return 1
  fi

  if [[ -n "${existing_group}" && "${existing_group}" != "${APP_USER}" ]]; then
    echo "Cannot remap ${APP_USER} to GID ${target_gid}; already used by ${existing_group}" >&2
    return 1
  fi

  if [[ -z "${existing_group}" ]]; then
    groupmod -o -g "${target_gid}" "${APP_USER}"
  fi

  if [[ -z "${existing_user}" ]]; then
    usermod -o -u "${target_uid}" -g "${target_gid}" "${APP_USER}"
  fi

  chown "${target_uid}:${target_gid}" "${APP_HOME}"

  while IFS= read -r -d '' home_entry; do
    chown -hR "${target_uid}:${target_gid}" "${home_entry}"
  done < <(find "${APP_HOME}" -mindepth 1 -maxdepth 1 \
    ! -path "${SHARED_DIR}" \
    ! -path "${KUBE_DIR}" \
    -print0)
}

# Fix kubeconfig permissions — the dotkube volume may be owned by a different UID.
if [[ -d "${KUBE_DIR}" ]]; then
  chmod -R a+r "${KUBE_DIR}" 2>/dev/null || true
  find "${KUBE_DIR}" -type d -exec chmod a+x {} + 2>/dev/null || true
fi

if [[ -f .env ]];then
  # Export variables defined in .env file
  # without overwriting any existing environment variables
  source .env
  export $(grep -v -f <(echo -e "$(env)") <(echo -e "$(cut -d= -f1 .env)"))
fi

if [[ "$(id -u)" -eq 0 ]]; then
  sync_app_user_to_dir_owner "${SHARED_DIR}" || true

  exec setpriv \
    --reuid "$(id -u "${APP_USER}")" \
    --regid "$(id -g "${APP_USER}")" \
    --init-groups \
    bt-webterminal "$@"
fi

exec bt-webterminal "$@"
