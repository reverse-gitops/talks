# Demo Repo Volume Ownership Analysis

Date: 2026-03-21

## Executive summary

The shared Docker volume `talks-demo-repo` is mounted into three different environments:

- the devcontainer at `/workspaces/talks/the-gitops-paradox/demo-repo`
- `gitea-sync` at `/sync`
- `btwebterminal` at `/home/node/demo`

All three are supposed to work on the same Git checkout without permission problems.

That is not what actually happens today.

The core problem is that `gitea-sync` runs Git as `root`, while the devcontainer and the interactive shells in `btwebterminal` run as `node` with UID/GID `1001:1001`. `gitea-sync` tries to repair ownership afterward with `chown -R`, but it only does that at startup and when `HEAD` changes after a sync. A plain `git fetch` can still update remote-tracking refs and reflogs as `root` without triggering that repair step.

That is exactly what happened to:

- `.git/refs/remotes/origin/monster`
- `.git/logs/refs/remotes/origin/monster`

Those files became `root:node` (`0:1001`), mode `0644`, so a later `git push` from the `node` user in `btwebterminal` could not append to the reflog:

`unable to append to '.git/logs/refs/remotes/origin/monster': Permission denied`

## Short answer

Who creates the volume:

- Docker creates the named volume automatically the first time some container mounts `talks-demo-repo`.
- From the codebase, the volume can be auto-created either by the devcontainer mount or by the `docker run` commands in `Makefile`.
- Docker does not store "creator container" metadata for named volumes, so after the fact we can only narrow this down by timestamps.

Who fills the volume:

- `gitea-sync` is the component that populates the repo contents. It clones the Git repo into the mounted volume and keeps it updated.
- The devcontainer does not clone the repo into that volume. It only mounts it and then fixes permissions with `chown/chmod`.
- `btwebterminal` does not populate the volume at startup either. It mounts the same checkout and lets the interactive user modify it.

Which UID/GID values matter right now:

- devcontainer runtime user: `node` = `1001:1001`
- `btwebterminal` build-time user: `node` = `1000:1000`
- `btwebterminal` runtime user after entrypoint remap: `node` = `1001:1001`
- `gitea-sync` runtime user: `root` = `0:0`
- shared repo volume contents are mostly forced to `1001:1001`
- the broken Git internal files were recreated by `root` and ended up as `0:1001`

## What the code says

### 1. `Makefile`

Relevant behavior:

- `SYNC_OWNER_UID ?= $(shell id -u)`
- `SYNC_OWNER_GID ?= $(shell id -g)`
- `run-repo-sync` starts `gitea-sync` with:
  - `-e CHECKOUT_DIR=/sync`
  - `-e SYNC_OWNER_UID=$(SYNC_OWNER_UID)`
  - `-e SYNC_OWNER_GID=$(SYNC_OWNER_GID)`
  - `-v talks-demo-repo:/sync`
- `run-btwebterminal` starts `btwebterminal` with:
  - `-v talks-demo-repo:/home/node/demo`

Implication:

- The host that runs `make` decides which UID/GID `gitea-sync` should `chown` to.
- In the current environment, that host is the devcontainer shell, so `id -u` and `id -g` resolve to `1001` and `1001`.

### 2. `tools/gitea-sync/Dockerfile`

Relevant behavior:

- No non-root user is created.
- No `USER` directive is set.
- Container runs as `root`.

Implication:

- Every Git operation in this container runs as UID/GID `0:0`.

### 3. `tools/gitea-sync/entrypoint.sh`

Relevant behavior:

- `sync_checkout_owner()` does `chown -R "${SYNC_OWNER_UID}:${SYNC_OWNER_GID}" "${CHECKOUT_DIR}"`
- It is called:
  - once after the initial clone
  - again only when the sync loop notices that `HEAD` changed after a fetch/merge

Implication:

- Ownership repair is not continuous.
- A root-owned file created during `git fetch` can survive if the fetch changed a remote-tracking ref but did not change local `HEAD`.

### 4. `tools/gitea-sync/clone-gitea-repo.sh`

Relevant behavior:

- This script clones or fetches the repo into the mounted volume.
- It configures:
  - `remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*`
  - local credentials file at `.git/.gitea-credentials`

Implication:

- The sync container is the component that creates Git internals inside `.git`.
- Because it runs as `root`, those internals are created as `root` first.

### 5. `tools/btwebterminal/Dockerfile`

Relevant behavior:

- Build-time `useradd --create-home --shell /bin/bash "$USER"`
- No explicit UID/GID is provided

Observed build-time identity:

- In the raw built image, `node` is `1000:1000`

Implication:

- `btwebterminal` starts from a normal image-local user, then depends on runtime remapping if the mounted directory owner is different.

### 6. `tools/btwebterminal/entrypoint.sh`

Relevant behavior:

- Starts as `root`
- Stats the mounted repo directory
- Remaps the `node` user and group to match the mounted directory owner
- Uses `setpriv` to run `bt-webterminal` as that remapped `node` user

Observed runtime identity:

- `node` became `1001:1001`
- `bt-webterminal` process runs as `node`
- interactive shell PTYs also run as `node`

Implication:

- `btwebterminal` is doing the right thing for the interactive user path.
- The push error is not because the web terminal is still running as root.

### 7. `.devcontainer/devcontainer.json`

Relevant behavior:

- Mounts `talks-demo-repo` at `/workspaces/talks/the-gitops-paradox/demo-repo`
- Sets:
  - `"containerUser": "node"`
  - `"remoteUser": "node"`
  - `"updateRemoteUserUID": true`
- Runs `.devcontainer/fix-mounted-permissions.sh` on container start

Observed runtime identity:

- devcontainer `node` is `1001:1001`

Implication:

- The devcontainer user is already aligned with the mounted repo volume.

### 8. `.devcontainer/fix-mounted-permissions.sh`

Relevant behavior:

- `chown -R "$(id -u):$(id -g)" "${demo_repo_dir}"`
- `chmod -R ug+rwX`
- `find ... -type d -exec chmod g+s {} +`

Implication:

- Every devcontainer start aggressively normalizes the repo volume back to the devcontainer UID/GID.
- This helps, but it is still a repair pass.
- It does not stop `gitea-sync` from creating new root-owned Git files later.

## What is happening in the running environment

### Shared volume and container timestamps

Observed on 2026-03-21:

- `talks-demo-repo` volume created at `2026-03-21T18:17:58Z`
- current devcontainer container started later
- current `talks-demo-repo-sync` container started at `2026-03-21T21:15:21Z`
- current `talks-btwebterminal` container started at `2026-03-21T21:15:23Z`

What we can say:

- This specific volume already existed before the currently running `gitea-sync` and `btwebterminal` containers.
- Docker does not retain enough metadata to prove which earlier container first created it.
- From code, the possible creators are:
  - the devcontainer
  - `make run-repo-sync`
  - `make run-btwebterminal` because it depends on `run-repo-sync`

### Current ownership state

Observed:

- repo root: `1001:1001`, mode `2775`
- `.git`: `1001:1001`
- `.git/logs/refs/remotes/origin`: `1001:1001`
- `.git/logs/refs/remotes/origin/monster`: `0:1001`, mode `0644`
- `.git/refs/remotes/origin/monster`: `0:1001`, mode `0644`
- `.git/ORIG_HEAD`: `0:1001`, mode `0644`
- several Git object directories and objects: `0:1001`
- `.git/.gitea-credentials`: `0:1001`, mode `0600`

This is the important pattern:

- directory ownership is mostly repaired to `1001:1001`
- some individual Git files were later recreated by `root`

That is why the repo looks mostly healthy while specific Git commands still fail.

### Proof that `btwebterminal` shells are not the writer

Observed inside `talks-btwebterminal`:

- PID 1: `/usr/local/bin/python3.13 /usr/local/bin/bt-webterminal` as `node:node`
- PTY shell processes as `node:node`
- `kubectl port-forward` helper also as `node:node`

Implication:

- The interactive terminal path is not what created the `root`-owned reflog.

### Proof that `gitea-sync` touched `origin/monster` as root

Observed reflog in the shared repo:

- `refs/remotes/origin/monster@{2026-03-21 21:20:04 +0000}: fetch --prune --quiet origin: fast-forward`

Observed file metadata:

- `.git/refs/remotes/origin/monster` mtime `2026-03-21 21:20:04`
- `.git/logs/refs/remotes/origin/monster` mtime `2026-03-21 21:20:04`
- both owned by `0:1001`

Observed branch state:

- local checked-out branch is `monster`
- local `HEAD` was already at commit `3fe1d3f`
- remote-tracking ref `origin/monster` also moved to `3fe1d3f`

Implication:

- `gitea-sync` fetched the new remote commit as `root`
- that fetch updated `origin/monster` and its reflog as `root`
- because local `HEAD` was already at that commit, the later "only if HEAD changed" ownership repair did not run

This is the root cause of the failure you saw.

## Expected behavior

If this setup is going to work reliably, the shared volume should behave like this:

- the repo should have one stable owning UID/GID across all three environments
- every process that writes Git internals in the shared repo should run with that same UID/GID
- ownership repair should be a rare safety net, not a normal part of Git traffic
- a `git push` from `btwebterminal` should never fail because another container touched `.git/logs/refs/remotes/*` as `root`

Today the system violates the second rule.

## Actual ownership model today

### Volume creator

Actual rule:

- "creator" is not fixed in code
- Docker auto-creates the named volume when the first consumer starts and references it

Practical consequence:

- there is no single authoritative owner of volume creation
- startup order changes who creates it

### Volume filler

Actual rule:

- `gitea-sync` is the authoritative filler and synchronizer of repo contents

Practical consequence:

- the component that writes the repo the most is also the one running as `root`

### UID/GID contract

Actual rule:

- the intended shared owner is whatever `id -u` and `id -g` returned where `make` was run
- in this session that is `1001:1001`

Practical consequence:

- the intended contract is `1001:1001`
- but the main sync writer still writes as `0:0` first and only repairs later

## Why the exact push failed

Sequence:

1. `btwebterminal` shell, running as `node:1001`, committed and pushed branch `monster`.
2. `gitea-sync`, running as `root`, did `git fetch --prune --quiet origin`.
3. That fetch updated `refs/remotes/origin/monster` and `logs/refs/remotes/origin/monster` as `root`.
4. Local branch `monster` was already at the same commit, so `gitea-sync` did not detect a `HEAD` advance.
5. Because no `HEAD` advance was detected, `sync_checkout_owner()` did not run.
6. The reflog file stayed `root:node` with mode `0644`.
7. A later `git push` from the `node` user tried to append to `.git/logs/refs/remotes/origin/monster` and failed with `Permission denied`.

## Plan

### Recommendation

The real fix is to stop having `gitea-sync` write Git data as `root`.

Everything else is a repair strategy, not a solution.

### Phase 1: stop the bleeding

- Change `gitea-sync` so Git commands run as the target shared UID/GID instead of as `root`.
- Keep `root` only for setup that truly needs it.
- If needed, create a transient user/group for the numeric `SYNC_OWNER_UID` and `SYNC_OWNER_GID`, then `setpriv` or `su` into that identity before every Git operation.

Success criteria:

- `git clone`, `git fetch`, and `git merge` in `gitea-sync` produce files owned by `1001:1001`
- no `.git` files flip back to `root`

### Phase 2: make the ownership contract explicit

- Document that `1001:1001` is the shared writer identity in the devcontainer-driven workflow.
- Make the sync container fail fast if `SYNC_OWNER_UID` or `SYNC_OWNER_GID` is missing.
- Log the effective writer identity at container startup.

Success criteria:

- there is one documented answer to "which UID/GID owns the shared repo?"
- startup logs show that answer immediately

### Phase 3: keep a repair path, but demote it to a fallback

- Keep a repair command for existing broken volumes
- Add a dedicated `make` target or script that:
  - stops sync traffic
  - `chown -R 1001:1001` on the mounted repo
  - restores group-writable permissions if desired
  - restarts the affected containers

Success criteria:

- recovery is one command, not manual archaeology

### Phase 4: reduce ambiguity around volume creation

- Decide whether the devcontainer or `run-repo-sync` should be considered the canonical creator of `talks-demo-repo`
- Document that startup order expectation
- Optionally add a dedicated bootstrap target that creates the volume deliberately before either consumer starts

Success criteria:

- volume lifecycle is intentional instead of accidental

## Proposed implementation order

1. Fix `gitea-sync` to run Git as the shared UID/GID.
2. Add a repair command for already-dirty volumes.
3. Add a short startup log line in all three environments showing:
   - mounted path
   - effective user
   - numeric UID/GID
4. Add a short README section that points to this document.

## What I would expect after the fix

After the real fix, I would expect all of the following to be true:

- `stat` on `.git/refs/remotes/origin/monster` shows `1001:1001`
- `stat` on `.git/logs/refs/remotes/origin/monster` shows `1001:1001`
- repeated `git push` from `btwebterminal` works even while `gitea-sync` is polling
- the devcontainer startup script no longer needs to "fight" ownership drift caused by the sync container
- permission problems stop showing up as intermittent distractions

## Bottom line

The repo volume is supposed to be shared by one logical user identity, but one of the three participants is still writing Git internals as `root`.

That participant is `gitea-sync`.

Until that is changed, ownership will keep drifting back to `root` in small, hard-to-predict parts of `.git`, and interactive Git operations from `btwebterminal` will keep failing in exactly this annoying way.
