#!/usr/bin/env bash

set -euo pipefail

workspace_dir="${1:-${containerWorkspaceFolder:-${WORKSPACE_FOLDER:-$(pwd)}}}"

bash "${workspace_dir}/.devcontainer/fix-mounted-permissions.sh" "${workspace_dir}"

# Refresh signing on every start: this is the first hook that can expect a forwarded SSH
# agent, and a reconnect can change SSH_AUTH_SOCK or the loaded key. The helper reports
# missing credentials rather than failing; Git itself refuses an unsigned commit.
bash "${workspace_dir}/.devcontainer/sync-signing-key.sh" ||
  echo "[post-start] WARNING: sync-signing-key.sh failed; run it by hand to see why." >&2
