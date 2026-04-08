FROM node:24-bookworm

ARG KUBECTL_NEAT_VERSION=v2.0.4
ARG HTTPYAC_VERSION=6.16.7

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    httpie \
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
    # httpyac
    npm install -g "httpyac@${HTTPYAC_VERSION}" && \
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
