FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV KUBECTL_VERSION=v1.35.0
ENV KUBECONFIG=/kube/config
ENV REPO_NAME=demo
ENV SYNC_ROOT=/sync
ENV SYNC_INTERVAL_SECONDS=5

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      bash \
      ca-certificates \
      curl \
      git \
      procps && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSLo /usr/local/bin/kubectl "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" && \
    chmod +x /usr/local/bin/kubectl

COPY tools/gitea-sync/clone-gitea-repo.sh /usr/local/bin/clone-gitea-repo.sh
COPY tools/gitea-sync/entrypoint.sh /usr/local/bin/gitea-sync-entrypoint.sh

RUN chmod +x /usr/local/bin/clone-gitea-repo.sh /usr/local/bin/gitea-sync-entrypoint.sh

VOLUME ["/sync"]

ENTRYPOINT ["/usr/local/bin/gitea-sync-entrypoint.sh"]
