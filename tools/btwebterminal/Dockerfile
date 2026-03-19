FROM python:3.13-slim-bookworm

ARG GIT_COMMIT=unknown
ARG GIT_DIRTY=0
ARG BUILD_DATE=unknown

LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.revision=$GIT_COMMIT \
      io.z65.git.dirty=$GIT_DIRTY

ENV KUBECTL_VERSION=v1.35.0 \
    KUSTOMIZE_VERSION=5.8.1 \
    K3D_VERSION=v5.8.3 \
    FLUX_VERSION=2.8.0 \
    K9S_VERSION=v0.50.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV USER=node
ENV APP_DIR=/home/$USER/app
ENV PROJECT_DIR=/home/$USER/workspace
ENV CERT_DIR=/usr/local/share/ca-certificates
ENV WEBTERMINAL_HOST=0.0.0.0
ENV WEBTERMINAL_PORT=10001

SHELL ["/bin/bash", "-exo", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends bash ca-certificates curl git gnupg && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli && \
    rm -rf /var/lib/apt/lists/* && \
    useradd --create-home --shell /bin/bash "$USER" && \
    mkdir -p "$APP_DIR" "$PROJECT_DIR" && \
    chown -R "$USER:$USER" "/home/$USER"

# Install kubectl
RUN curl -fsSLo /usr/local/bin/kubectl "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" \
    && chmod +x /usr/local/bin/kubectl

# Install Kustomize
RUN curl -fsSLo /tmp/kustomize.tar.gz "https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${KUSTOMIZE_VERSION}/kustomize_v${KUSTOMIZE_VERSION}_linux_amd64.tar.gz" && \
    tar -xzf /tmp/kustomize.tar.gz -C /usr/local/bin kustomize && \
    chmod +x /usr/local/bin/kustomize && \
    rm /tmp/kustomize.tar.gz

# Install k3d (faster and kind alternative, also more stable with our docker-outside-docker setup)
RUN curl -fsSLo /usr/local/bin/k3d "https://github.com/k3d-io/k3d/releases/download/${K3D_VERSION}/k3d-linux-amd64" \
    && chmod +x /usr/local/bin/k3d

# Install Flux CLI
RUN curl -fsSL "https://github.com/fluxcd/flux2/releases/download/v${FLUX_VERSION}/flux_${FLUX_VERSION}_linux_amd64.tar.gz" \
    | tar -xzO flux > /usr/local/bin/flux \
    && chmod +x /usr/local/bin/flux

# Install k9s
RUN curl -fsSLo /tmp/k9s.tar.gz "https://github.com/derailed/k9s/releases/download/${K9S_VERSION}/k9s_Linux_amd64.tar.gz" && \
    tar -xzf /tmp/k9s.tar.gz -C /usr/local/bin k9s && \
    chmod +x /usr/local/bin/k9s && \
    rm /tmp/k9s.tar.gz

COPY openssl.cnf /etc/ssl/openssl.cnf
COPY . "$APP_DIR"

WORKDIR $APP_DIR

RUN if compgen -G "extra_certs/*.crt" > /dev/null; then \
      cp extra_certs/*.crt "$CERT_DIR" && \
      update-ca-certificates; \
    fi && \
    pip install --no-cache-dir . && \
    install -m 0755 entrypoint.sh /usr/local/bin/entrypoint.sh && \
    rm -f entrypoint.sh

USER $USER

WORKDIR $PROJECT_DIR

EXPOSE 10001

ENTRYPOINT ["entrypoint.sh"]
