FROM --platform=linux/amd64 tecknicos/devops-cli:1.0.0

ENV USER=svcdevops
ENV CERT_DIR=/usr/local/share/ca-certificates

# Change default shell for RUN from Dash to Bash
SHELL ["/bin/bash", "-exo", "pipefail", "-c"] 

# https://github.com/lutris/lutris/issues/4235#issuecomment-1125975574
ADD openssl.cnf /etc/ssl/openssl.cnf

COPY extra_certs /tmp

RUN if ls /tmp/extra_certs/*.crt; then \
      cp /tmp/extra_certs/*.crt $CERT_DIR; \
      update-ca-certificates; \
    fi

RUN rm -rf /tmp/extra_certs

ADD entrypoint.sh /usr/local/bin

RUN sudo chmod +x /usr/local/bin/entrypoint.sh

USER $USER
# Run commands and tests as $USER user
RUN whoami && \
  # opt-out of the new security feature, not needed in a CI environment
  git config --global --add safe.directory '*'

ENV APP_DIR=/home/$USER/app
ENV PROJECT_DIR=/home/$USER/workspace

WORKDIR $APP_DIR

ADD . .

RUN sudo pip3 install .

RUN rm -f entrypoint.sh

WORKDIR $PROJECT_DIR

ENTRYPOINT [ "entrypoint.sh" ]