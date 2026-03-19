#!/bin/bash

set -e

echo "Starting Main Process ..."

# Fix kubeconfig permissions — the dotkube volume may be owned by a different UID
chmod -R a+r /home/node/.kube 2>/dev/null || true
find /home/node/.kube -type d -exec chmod a+x {} + 2>/dev/null || true

if [[ -f .env ]];then
  # Export variables defined in .env file
  # without overwriting any existing environment variables
  source .env
  export $(grep -v -f <(echo -e "$(env)") <(echo -e "$(cut -d= -f1 .env)"))
fi

exec bt-webterminal "$@"
