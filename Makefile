SHELL := /bin/bash

DEMO_REPO_VOLUME ?= talks-demo-repo
KUBE_VOLUME ?= dotkube
SHARED_HOME_VOLUME ?= talks-persisted-home

GITEA_SYNC_IMAGE ?= talks-gitea-sync:latest
GITEA_SYNC_CONTAINER ?= talks-demo-repo-sync
GITEA_SYNC_INTERVAL_SECONDS ?= 5
REPO_NAME ?= demo

BTWEBTERMINAL_IMAGE ?= talks-btwebterminal:latest
BTWEBTERMINAL_CONTAINER ?= talks-btwebterminal
BTWEBTERMINAL_PORT ?= 10001

.PHONY: start-demo-repo-sync start-btwebterminal start

run-repo-sync:
	docker build -f tools/gitea-sync/Dockerfile -t $(GITEA_SYNC_IMAGE) .
	docker rm -f $(GITEA_SYNC_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(GITEA_SYNC_CONTAINER) \
		--add-host host.docker.internal:host-gateway \
		-e REPO_NAME=$(REPO_NAME) \
		-e CHECKOUT_DIR=/sync \
		-e SYNC_INTERVAL_SECONDS=$(GITEA_SYNC_INTERVAL_SECONDS) \
		-v $(DEMO_REPO_VOLUME):/sync \
		-v $(KUBE_VOLUME):/root/.kube \
		$(GITEA_SYNC_IMAGE)
	@echo "Started $(GITEA_SYNC_CONTAINER) with volume $(DEMO_REPO_VOLUME)"

run-btwebterminal: run-repo-sync
	docker build -f tools/btwebterminal/Dockerfile -t $(BTWEBTERMINAL_IMAGE) tools/btwebterminal
	docker rm -f $(BTWEBTERMINAL_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(BTWEBTERMINAL_CONTAINER) \
		--add-host host.docker.internal:host-gateway \
		-p $(BTWEBTERMINAL_PORT):$(BTWEBTERMINAL_PORT) \
		-e WEBTERMINAL_HOST=0.0.0.0 \
		-e WEBTERMINAL_PORT=$(BTWEBTERMINAL_PORT) \
		-e KUBECONFIG=/home/node/.kube/config \
		-v $(KUBE_VOLUME):/home/node/.kube \
		-v $(DEMO_REPO_VOLUME):/home/node/demo \
		$(BTWEBTERMINAL_IMAGE)
	@echo "Started $(BTWEBTERMINAL_CONTAINER) on http://host.docker.internal:$(BTWEBTERMINAL_PORT)"

run: run-btwebterminal
	cd the-gitops-paradox && npm run dev
