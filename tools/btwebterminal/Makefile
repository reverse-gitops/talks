IMAGE ?= zot.z65.nl/present/bt-webterminal:latest
CONTAINER_NAME ?= bt-webterminal
PLATFORM ?= linux/amd64
HOST ?= 127.0.0.1
PORT ?= 10001
HOME_DIR ?= $(HOME)
KUBE_DIR ?= $(HOME_DIR)/.kube
DOCKER_SOCK ?= /var/run/docker.sock
DOCKER_SOCK_GID ?= $(shell stat -c '%g' $(DOCKER_SOCK) 2>/dev/null || echo 0)
PYTHON ?= python3
PIP ?= $(PYTHON) -m pip

.PHONY: build run-container install-local run-local build-push

build:
	docker buildx build --load \
		--platform $(PLATFORM) \
		-t $(IMAGE) .

run-container: build
	docker run --rm -it \
		--name $(CONTAINER_NAME) \
		--network host \
		--add-host host.docker.internal:host-gateway \
		--group-add $(DOCKER_SOCK_GID) \
		-e WEBTERMINAL_HOST=0.0.0.0 \
		-e WEBTERMINAL_PORT=$(PORT) \
		-e DOCKER_HOST=unix://$(DOCKER_SOCK) \
		-e KUBECONFIG=/home/svcdevops/.kube/config \
		-v $(DOCKER_SOCK):$(DOCKER_SOCK) \
		-v $(KUBE_DIR):/home/svcdevops/.kube \
		$(IMAGE)

install-local:
	$(PIP) install --editable .

run-local: install-local
	bt-webterminal --host $(HOST) --port $(PORT)

build-push:
	docker buildx build --push \
		--platform $(PLATFORM) \
		--build-arg GIT_COMMIT="$$(git rev-parse --short HEAD 2>/dev/null || echo unknown)" \
		--build-arg GIT_DIRTY="$$(test -n "$$(git status --porcelain 2>/dev/null)" && echo 1 || echo 0)" \
		--build-arg BUILD_DATE="$$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
		--provenance=true \
		--sbom=true \
		-t $(IMAGE) .
