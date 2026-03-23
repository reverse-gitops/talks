#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: merge-holland-stuff.sh [repo-dir]

Checks out the holland-stuff branch, merges it into main with a merge commit,
pushes main, and then deletes holland-stuff both locally and on origin.
Before doing any Git operations, it ensures the Gitea port-forward is ready.

Defaults:
  repo-dir: current directory
  GIT_REMOTE=origin
  SOURCE_BRANCH=holland-stuff
  TARGET_BRANCH=main
EOF
}

require_cmd() {
  local cmd="$1"
  command -v "${cmd}" >/dev/null 2>&1 || {
    echo "ERROR: required command not found: ${cmd}" >&2
    exit 1
  }
}

ensure_gitea_port_forward() {
  local script_dir pf_script

  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  pf_script="${script_dir}/pf-gitea.sh"

  [[ -f "${pf_script}" ]] || {
    echo "ERROR: required helper script not found: ${pf_script}" >&2
    exit 1
  }

  bash "${pf_script}"
}

ensure_clean_worktree() {
  local repo_dir="$1"

  if ! git -C "${repo_dir}" diff --quiet || ! git -C "${repo_dir}" diff --cached --quiet; then
    echo "ERROR: working tree has uncommitted changes in ${repo_dir}" >&2
    exit 1
  fi
}

ensure_repo() {
  local repo_dir="$1"

  git -C "${repo_dir}" rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
    echo "ERROR: not a git repository: ${repo_dir}" >&2
    exit 1
  }
}

local_branch_exists() {
  local repo_dir="$1"
  local branch="$2"

  git -C "${repo_dir}" show-ref --verify --quiet "refs/heads/${branch}"
}

remote_branch_exists() {
  local repo_dir="$1"
  local remote="$2"
  local branch="$3"

  git -C "${repo_dir}" show-ref --verify --quiet "refs/remotes/${remote}/${branch}"
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

require_cmd git

REPO_DIR="${1:-$PWD}"
GIT_REMOTE="${GIT_REMOTE:-origin}"
SOURCE_BRANCH="${SOURCE_BRANCH:-holland-stuff}"
TARGET_BRANCH="${TARGET_BRANCH:-main}"

echo "0/5 Ensuring Gitea port-forward"
ensure_gitea_port_forward

ensure_repo "${REPO_DIR}"
ensure_clean_worktree "${REPO_DIR}"

echo "1/5 Fetching ${GIT_REMOTE}"
git -C "${REPO_DIR}" fetch "${GIT_REMOTE}" --prune

echo "2/5 Checking out ${SOURCE_BRANCH}"
if ! local_branch_exists "${REPO_DIR}" "${SOURCE_BRANCH}"; then
  if remote_branch_exists "${REPO_DIR}" "${GIT_REMOTE}" "${SOURCE_BRANCH}"; then
    git -C "${REPO_DIR}" switch -c "${SOURCE_BRANCH}" --track "${GIT_REMOTE}/${SOURCE_BRANCH}"
  else
    echo "ERROR: branch ${SOURCE_BRANCH} not found locally or on ${GIT_REMOTE}" >&2
    exit 1
  fi
else
  git -C "${REPO_DIR}" switch "${SOURCE_BRANCH}"
fi

if remote_branch_exists "${REPO_DIR}" "${GIT_REMOTE}" "${SOURCE_BRANCH}"; then
  git -C "${REPO_DIR}" merge --ff-only "${GIT_REMOTE}/${SOURCE_BRANCH}"
fi

echo "3/5 Checking out ${TARGET_BRANCH}"
if local_branch_exists "${REPO_DIR}" "${TARGET_BRANCH}"; then
  git -C "${REPO_DIR}" switch "${TARGET_BRANCH}"
else
  git -C "${REPO_DIR}" switch -c "${TARGET_BRANCH}" --track "${GIT_REMOTE}/${TARGET_BRANCH}"
fi

if remote_branch_exists "${REPO_DIR}" "${GIT_REMOTE}" "${TARGET_BRANCH}"; then
  git -C "${REPO_DIR}" merge --ff-only "${GIT_REMOTE}/${TARGET_BRANCH}"
fi

echo "4/5 Merging ${SOURCE_BRANCH} into ${TARGET_BRANCH}"
git -C "${REPO_DIR}" merge --no-ff "${SOURCE_BRANCH}" -m "Merge branch '${SOURCE_BRANCH}'"

echo "5/5 Pushing ${TARGET_BRANCH} and deleting ${SOURCE_BRANCH}"
git -C "${REPO_DIR}" push "${GIT_REMOTE}" "${TARGET_BRANCH}"
git -C "${REPO_DIR}" branch -d "${SOURCE_BRANCH}"
git -C "${REPO_DIR}" push "${GIT_REMOTE}" --delete "${SOURCE_BRANCH}"

echo "Done: ${SOURCE_BRANCH} merged into ${TARGET_BRANCH} and deleted locally and on ${GIT_REMOTE}"
