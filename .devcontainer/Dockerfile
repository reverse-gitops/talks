FROM node:24-bookworm

ARG KUBECTL_NEAT_VERSION=v2.0.4
ARG KUBELOGIN_VERSION=v1.36.4
ARG K3D_VERSION=v5.8.3
ARG HTTPYAC_VERSION=6.16.7
ARG KUBECTL_VERSION=v1.37.2
ARG YQ_VERSION=v4.54.1
ARG MARP_CLI_VERSION=4.5.1
ARG MERMAID_CLI_VERSION=12.0.0
# Kubernetes / GitOps tooling, versions kept in step with external/gitops-reverser.
ARG KREW_VERSION=v0.5.0
ARG HELM_VERSION=v4.3.1
ARG KUSTOMIZE_VERSION=5.8.3
ARG FLUX_VERSION=2.9.6
ARG FLUX_OPERATOR_VERSION=0.61.0
ARG TASK_VERSION=v3.54.0
ARG COSIGN_VERSION=v3.1.4
ARG ORAS_VERSION=1.3.6
ARG TRIVY_VERSION=0.76.1
ARG DIVE_VERSION=0.13.1
ARG STARSHIP_VERSION=v1.26.0

# Run RUN steps under bash with pipefail, so a failing download in a `curl ... | bash`
# pipeline aborts the build instead of silently installing nothing.
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    ffmpeg \
    httpie \
    jq \
    tree \
    sudo \
    fonts-freefont-ttf \
    fonts-ipafont-gothic \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-tlwg-loma-otf \
    fonts-unifont \
    fonts-wqy-zenhei \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libfontconfig1 \
    libfreetype6 \
    libgbm1 \
    libgl1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxshmfence1 \
    poppler-utils \
    xfonts-scalable \
    xvfb && \
    echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node && \
    # kubectl
    curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && rm kubectl && \
    # kubectl-neat
    curl -fsSL "https://github.com/itaysk/kubectl-neat/releases/download/${KUBECTL_NEAT_VERSION}/kubectl-neat_linux_amd64.tar.gz" -o /tmp/kubectl-neat.tar.gz && \
    tar -xzf /tmp/kubectl-neat.tar.gz -C /tmp kubectl-neat && \
    install -o root -g root -m 0755 /tmp/kubectl-neat /usr/local/bin/kubectl-neat && \
    rm -f /tmp/kubectl-neat /tmp/kubectl-neat.tar.gz && \
    # kubelogin, installed as the kubectl plugin `kubectl oidc-login`
    curl -fsSL "https://github.com/int128/kubelogin/releases/download/${KUBELOGIN_VERSION}/kubelogin_linux_amd64.zip" -o /tmp/kubelogin.zip && \
    unzip -o -q /tmp/kubelogin.zip kubelogin -d /tmp && \
    install -o root -g root -m 0755 /tmp/kubelogin /usr/local/bin/kubectl-oidc_login && \
    rm -f /tmp/kubelogin /tmp/kubelogin.zip && \
    # k3d
    curl -fsSL https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | TAG="${K3D_VERSION}" bash && \
    # yq
    curl -fsSL "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/yq_linux_amd64" -o /usr/local/bin/yq && \
    chmod +x /usr/local/bin/yq && \
    # httpyac
    npm install -g "httpyac@${HTTPYAC_VERSION}" && \
    # marp-cli and mermaid-cli render the Marp decks and .mmd diagrams. They use the
    # Playwright Chromium that post-create.sh links to /home/node/.local/bin/chrome
    # (CHROME_PATH / PUPPETEER_EXECUTABLE_PATH), so they don't download their own.
    PUPPETEER_SKIP_DOWNLOAD=1 npm install -g "@marp-team/marp-cli@${MARP_CLI_VERSION}" && \
    PUPPETEER_SKIP_DOWNLOAD=1 npm install -g --prefix /opt/mermaid-cli "@mermaid-js/mermaid-cli@${MERMAID_CLI_VERSION}" && \
    # Chrome has no usable sandbox inside the container, so mmdc always gets --no-sandbox.
    printf '{ "args": ["--no-sandbox"] }\n' > /opt/mermaid-cli/puppeteer-config.json && \
    printf '#!/bin/sh\nexec /opt/mermaid-cli/bin/mmdc -p /opt/mermaid-cli/puppeteer-config.json "$@"\n' > /usr/local/bin/mmdc && \
    chmod +x /usr/local/bin/mmdc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


# GitHub CLI, from its own apt repository.
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg && \
    chmod a+r /etc/apt/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      > /etc/apt/sources.list.d/github-cli.list && \
    apt-get update && apt-get install -y --no-install-recommends gh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Release binaries. fetch_verified downloads an asset plus the release's combined
# checksums file and checks the asset against it before anything is installed.
RUN fetch_verified() { \
      curl -fsSL "$1/$2" -o "$2" && curl -fsSL "$1/$3" -o checksums.txt && \
      grep "  $2$" checksums.txt | sha256sum -c -; \
    } && \
    tmpdir="$(mktemp -d)" && cd "${tmpdir}" && \
    # helm
    curl -fsSL "https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz" | tar -xzO linux-amd64/helm > /usr/local/bin/helm && \
    chmod +x /usr/local/bin/helm && \
    # kustomize
    curl -fsSL "https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${KUSTOMIZE_VERSION}/kustomize_v${KUSTOMIZE_VERSION}_linux_amd64.tar.gz" | tar -xzO kustomize > /usr/local/bin/kustomize && \
    chmod +x /usr/local/bin/kustomize && \
    # flux
    curl -fsSL "https://github.com/fluxcd/flux2/releases/download/v${FLUX_VERSION}/flux_${FLUX_VERSION}_linux_amd64.tar.gz" | tar -xzO flux > /usr/local/bin/flux && \
    chmod +x /usr/local/bin/flux && \
    # flux-operator
    fetch_verified "https://github.com/controlplaneio-fluxcd/flux-operator/releases/download/v${FLUX_OPERATOR_VERSION}" \
      "flux-operator_${FLUX_OPERATOR_VERSION}_linux_amd64.tar.gz" "flux-operator_${FLUX_OPERATOR_VERSION}_checksums.txt" && \
    tar -xzf "flux-operator_${FLUX_OPERATOR_VERSION}_linux_amd64.tar.gz" flux-operator && install -m 0755 flux-operator /usr/local/bin/flux-operator && \
    # task
    curl -fsSL "https://github.com/go-task/task/releases/download/${TASK_VERSION}/task_linux_amd64.tar.gz" | tar -xzO task > /usr/local/bin/task && \
    chmod +x /usr/local/bin/task && \
    # cosign
    fetch_verified "https://github.com/sigstore/cosign/releases/download/${COSIGN_VERSION}" cosign-linux-amd64 cosign_checksums.txt && \
    install -m 0755 cosign-linux-amd64 /usr/local/bin/cosign && \
    # oras
    fetch_verified "https://github.com/oras-project/oras/releases/download/v${ORAS_VERSION}" \
      "oras_${ORAS_VERSION}_linux_amd64.tar.gz" "oras_${ORAS_VERSION}_checksums.txt" && \
    tar -xzf "oras_${ORAS_VERSION}_linux_amd64.tar.gz" oras && install -m 0755 oras /usr/local/bin/oras && \
    # trivy (image vulnerability scanner)
    fetch_verified "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}" \
      "trivy_${TRIVY_VERSION}_Linux-64bit.tar.gz" "trivy_${TRIVY_VERSION}_checksums.txt" && \
    tar -xzf "trivy_${TRIVY_VERSION}_Linux-64bit.tar.gz" trivy && install -m 0755 trivy /usr/local/bin/trivy && \
    # dive (browse an image's layers and what each one adds)
    fetch_verified "https://github.com/wagoodman/dive/releases/download/v${DIVE_VERSION}" \
      "dive_${DIVE_VERSION}_linux_amd64.tar.gz" "dive_${DIVE_VERSION}_checksums.txt" && \
    tar -xzf "dive_${DIVE_VERSION}_linux_amd64.tar.gz" dive && install -m 0755 dive /usr/local/bin/dive && \
    # krew binary, bootstrapped into the node user's ~/.krew below
    # (its .sha256 file holds only the bare hash, so it is checked directly)
    curl -fsSL "https://github.com/kubernetes-sigs/krew/releases/download/${KREW_VERSION}/krew-linux_amd64.tar.gz" -o krew-linux_amd64.tar.gz && \
    echo "$(curl -fsSL "https://github.com/kubernetes-sigs/krew/releases/download/${KREW_VERSION}/krew-linux_amd64.tar.gz.sha256")  krew-linux_amd64.tar.gz" | sha256sum -c - && \
    tar -xzf krew-linux_amd64.tar.gz ./krew-linux_amd64 && install -m 0755 krew-linux_amd64 /usr/local/bin/krew-bootstrap && \
    # starship prompt (its .sha256 file also holds only the bare hash)
    curl -fsSL "https://github.com/starship/starship/releases/download/${STARSHIP_VERSION}/starship-x86_64-unknown-linux-musl.tar.gz" -o starship.tar.gz && \
    echo "$(curl -fsSL "https://github.com/starship/starship/releases/download/${STARSHIP_VERSION}/starship-x86_64-unknown-linux-musl.tar.gz.sha256")  starship.tar.gz" | sha256sum -c - && \
    tar -xzf starship.tar.gz starship && install -m 0755 starship /usr/local/bin/starship && \
    cd / && rm -rf "${tmpdir}"


RUN mkdir -p \
    /home/node/.npm \
    /home/node/.cache/ms-playwright \
    /home/node/.codex \
    /home/node/.claude \
    /home/node/shared \
    /home/node/.config/git \
    /home/node/.kube \
    /home/node/.ssh \
 && chown -R node:node /home/node

# The same short prompt as the KubeCon terminal: directory, git branch and status.
# Only in the slides' terminals: docker-exec-bridge sets BRIDGE_SESSION on every shell.
COPY --chown=node:node starship.toml /home/node/.config/starship.toml
RUN echo 'if [ -n "$BRIDGE_SESSION" ]; then eval "$(starship init bash)"; fi' >> /home/node/.bashrc

# krew installs plugins into the node user's home, so bootstrap it as node.
USER node
RUN krew-bootstrap install krew
USER root
ENV PATH="/home/node/.krew/bin:${PATH}"
