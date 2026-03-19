# Dockerfile for Talks / Slidev presentations
FROM node:22-bookworm

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Install essential packages
RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    ca-certificates \
    vim \
    less \
    jq \
    sudo \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspaces

# Create vscode user for non-root development
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid vscode --shell /bin/bash --create-home vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

# Ensure vscode user can write to workspace
RUN chown -R vscode:vscode /workspaces && \
    chmod -R 755 /workspaces

# Switch to vscode user for development
USER vscode

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog

# Default command
CMD ["/bin/bash"]
