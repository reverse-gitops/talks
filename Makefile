SHELL := /bin/bash

DEMO_REPO_VOLUME ?= talks-demo-repo
KUBE_VOLUME ?= dotkube
SHARED_HOME_VOLUME ?= talks-persisted-home
NPM ?= npm

GITEA_SYNC_IMAGE ?= talks-gitea-sync:latest
GITEA_SYNC_CONTAINER ?= talks-demo-repo-sync
GITEA_SYNC_INTERVAL_SECONDS ?= 5
SECRET_NAMESPACE ?= vote
SYNC_OWNER_UID ?= $(shell id -u)
SYNC_OWNER_GID ?= $(shell id -g)
REPO_NAME ?= demo

BTWEBTERMINAL_IMAGE ?= talks-btwebterminal:latest
BTWEBTERMINAL_CONTAINER ?= talks-btwebterminal
BTWEBTERMINAL_PORT ?= 10001

NODE_TOOL_DIRS := tools/slidev-addon-excalidraw-renderer tools/slidev-addon-web-terminal
NODE_APP_DIRS := $(sort $(patsubst %/,%,$(dir $(wildcard */package.json))))
NODE_TOOL_STAMPS := $(NODE_TOOL_DIRS:%=%/node_modules/.install-stamp)
NODE_APP_STAMPS := $(NODE_APP_DIRS:%=%/node_modules/.install-stamp)

SLIDEV_ADDON_EXCALIDRAW_FILES := $(shell find tools/slidev-addon-excalidraw-renderer \
	-path '*/node_modules' -prune -o \
	-type f -print)
SLIDEV_ADDON_WEB_TERMINAL_FILES := $(shell find tools/slidev-addon-web-terminal \
	-path '*/node_modules' -prune -o \
	-path 'tools/slidev-addon-web-terminal/example' -prune -o \
	-type f -print)

.PHONY: install-node-deps run-repo-sync run-btwebterminal run empty-demo-repo

install-node-deps: $(NODE_TOOL_STAMPS) $(NODE_APP_STAMPS)

$(NODE_TOOL_STAMPS): %/node_modules/.install-stamp: %/package.json %/package-lock.json
	$(NPM) install --prefix $*
	@touch $@

the-gitops-paradox/node_modules/.install-stamp: $(SLIDEV_ADDON_EXCALIDRAW_FILES) $(SLIDEV_ADDON_WEB_TERMINAL_FILES)

$(NODE_APP_STAMPS): %/node_modules/.install-stamp: %/package.json %/package-lock.json $(NODE_TOOL_STAMPS)
	$(NPM) install --prefix $*
	@touch $@

run-repo-sync:
	docker build -f tools/gitea-sync/Dockerfile -t $(GITEA_SYNC_IMAGE) .
	docker rm -f $(GITEA_SYNC_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(GITEA_SYNC_CONTAINER) \
		--add-host host.docker.internal:host-gateway \
		-e REPO_NAME=$(REPO_NAME) \
		-e SECRET_NAMESPACE=$(SECRET_NAMESPACE) \
		-e CHECKOUT_DIR=/sync \
		-e SYNC_INTERVAL_SECONDS=$(GITEA_SYNC_INTERVAL_SECONDS) \
		-e SYNC_OWNER_UID=$(SYNC_OWNER_UID) \
		-e SYNC_OWNER_GID=$(SYNC_OWNER_GID) \
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
		-e SECRET_NAMESPACE=$(SECRET_NAMESPACE) \
		-v $(KUBE_VOLUME):/home/node/.kube \
		-v $(DEMO_REPO_VOLUME):/home/node/demo \
		$(BTWEBTERMINAL_IMAGE)
	@echo "Started $(BTWEBTERMINAL_CONTAINER) on http://host.docker.internal:$(BTWEBTERMINAL_PORT)"

empty-demo-repo:
	docker run --rm \
		-v $(DEMO_REPO_VOLUME):/sync \
		alpine:3.20 \
		sh -lc 'find /sync -mindepth 1 -exec rm -rf -- {} +'
	@echo "Emptied volume $(DEMO_REPO_VOLUME)"

run: install-node-deps run-btwebterminal
	cd the-gitops-paradox && npm run dev
