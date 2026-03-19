FROM node:24-bookworm

RUN apt-get update && apt-get install -y curl ca-certificates && \
    # kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && rm kubectl && \
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
    /home/node/persisted-home \
    /home/node/.config/git \
    /home/node/.kube \
    /home/node/.ssh \
 && chown -R node:node /home/node