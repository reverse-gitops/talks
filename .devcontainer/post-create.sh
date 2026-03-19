#!/usr/bin/env bash

set -euo pipefail

log() {
  echo "[post-create] $*"
}

fail() {
  echo "[post-create] ERROR: $*" >&2
  exit 1
}

workspace_dir="${1:-${containerWorkspaceFolder:-${WORKSPACE_FOLDER:-$(pwd)}}}"
log "Using workspace directory: ${workspace_dir}"

# Resolve Git identity from effective config first, then fallback env vars.
git_name="$(git config --get user.name || true)"
git_email="$(git config --get user.email || true)"

if [ -z "${git_name}" ] && [ -n "${GIT_USER_NAME:-}" ]; then
  git_name="${GIT_USER_NAME}"
fi

if [ -z "${git_email}" ] && [ -n "${GIT_USER_EMAIL:-}" ]; then
  git_email="${GIT_USER_EMAIL}"
fi

if [ -z "${git_name}" ] || [ -z "${git_email}" ]; then
  fail "Missing Git identity. Set user.name and user.email in Git, or provide GIT_USER_NAME and GIT_USER_EMAIL to the devcontainer environment."
fi

# Persist identity globally in the container if it is not already configured there.
if ! git config --global --get user.name >/dev/null 2>&1; then
  git config --global user.name "${git_name}"
fi

if ! git config --global --get user.email >/dev/null 2>&1; then
  git config --global user.email "${git_email}"
fi

# Require SSH agent forwarding for signing.
if [ -z "${SSH_AUTH_SOCK:-}" ]; then
  fail "SSH agent not available in the devcontainer. Start ssh-agent on your machine, load your key with ssh-add, then reopen the devcontainer."
fi

agent_keys_file="$(mktemp)"
trap 'rm -f "${agent_keys_file}"' EXIT

if ! ssh-add -L >"${agent_keys_file}" 2>/dev/null; then
  fail "Could not read SSH keys from agent. Make sure your key is loaded on your machine with ssh-add, then reopen the devcontainer."
fi

if ! grep -qE '^ssh-' "${agent_keys_file}"; then
  fail "SSH agent is running but has no keys loaded. Run ssh-add ~/.ssh/id_ed25519 on your machine, then reopen the devcontainer."
fi

first_pubkey="$(head -n 1 "${agent_keys_file}")"

# Enforce SSH commit signing.
git config --global gpg.format ssh
git config --global commit.gpgsign true

mkdir -p /home/node/.config/git /home/node/.ssh
printf '%s\n' "${first_pubkey}" > /home/node/.ssh/devcontainer_signing_key.pub
chmod 600 /home/node/.ssh/devcontainer_signing_key.pub
git config --global user.signingkey /home/node/.ssh/devcontainer_signing_key.pub

# Useful for local verification output.
printf '%s <%s> %s\n' "${git_name}" "${git_email}" "${first_pubkey}" > /home/node/.config/git/allowed_signers
chmod 600 /home/node/.config/git/allowed_signers
git config --global gpg.ssh.allowedSignersFile /home/node/.config/git/allowed_signers

log "Git identity and SSH signing configured"

# Persist the ~/.claude.json file by making it a symlink (this trick can be used for other potenial config file in the home folder as well)
mkdir -p /home/node/persisted-home
touch /home/node/persisted-home/.claude.json
rm -f /home/node/.claude.json
ln -s /home/node/persisted-home/.claude.json /home/node/.claude.json

log "post-create completed"
