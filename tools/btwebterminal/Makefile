IMAGE ?= zot.z65.nl/present/bt-webterminal:latest
CONTAINER_NAME ?= bt-webterminal
PLATFORM ?= linux/amd64
HOST ?= 127.0.0.1
PORT ?= 10001
KUBE_VOLUME ?= dotkube
PYTHON ?= python3
PIP ?= $(PYTHON) -m pip

.PHONY: build run-container install-local run-local build-push

build:
	docker buildx build --load \
		--platform $(PLATFORM) \
		-t $(IMAGE) .

run: build
	docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	docker run --rm -it \
		--name $(CONTAINER_NAME) \
		--add-host host.docker.internal:host-gateway \
		-p $(PORT):$(PORT) \
		-e WEBTERMINAL_HOST=0.0.0.0 \
		-e WEBTERMINAL_PORT=$(PORT) \
		-e KUBECONFIG=/home/node/.kube/config \
		-v $(KUBE_VOLUME):/home/node/.kube \
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
