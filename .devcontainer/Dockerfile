FROM node:24-bookworm

ARG KUBECTL_NEAT_VERSION=v2.0.4

RUN apt-get update && apt-get install -y curl ca-certificates sudo && \
    echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node && \
    # kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && rm kubectl && \
    # kubectl-neat
    curl -fsSL "https://github.com/itaysk/kubectl-neat/releases/download/${KUBECTL_NEAT_VERSION}/kubectl-neat_linux_amd64.tar.gz" -o /tmp/kubectl-neat.tar.gz && \
    tar -xzf /tmp/kubectl-neat.tar.gz -C /tmp kubectl-neat && \
    install -o root -g root -m 0755 /tmp/kubectl-neat /usr/local/bin/kubectl-neat && \
    rm -f /tmp/kubectl-neat /tmp/kubectl-neat.tar.gz && \
    # k3d
    curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash && \
    # yq
    curl -sL "https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64" -o /usr/local/bin/yq && \
    chmod +x /usr/local/bin/yq && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


RUN mkdir -p \
    /home/node/.npm \
    /home/node/.codex \
    /home/node/.claude \
    /home/node/shared \
    /home/node/.config/git \
    /home/node/.kube \
    /home/node/.ssh \
 && chown -R node:node /home/node
