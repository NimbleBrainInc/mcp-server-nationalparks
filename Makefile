# MCPB bundle configuration
VERSION ?= 0.2.0

.PHONY: help build clean bundle bundle-run run run-stdio run-http test-http bump check

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build TypeScript
	npm run build

clean: ## Clean build artifacts
	rm -rf build/ *.mcpb

run: ## Run the MCP server (HTTP mode)
	node build/index.js

run-stdio: ## Run in stdio mode (for mpak / Claude Desktop)
	node build/index.js --stdio

run-http: run ## Alias for run

test-http: ## Test HTTP server is running
	@echo "Testing health endpoint..."
	@curl -s http://localhost:8000/health | grep -q "healthy" && echo "✓ Server is healthy" || echo "✗ Server not responding"

check: build ## Build and verify

# MCPB bundle commands
bundle: ## Build MCPB bundle locally
	@./scripts/build-bundle.sh . $(VERSION)

bundle-run: bundle ## Build and run MCPB bundle locally
	@BUNDLE=$$(ls -t *.mcpb 2>/dev/null | head -1); \
	if [ -z "$$BUNDLE" ]; then echo "No .mcpb bundle found"; exit 1; fi; \
	echo "Starting bundle $$BUNDLE with mcpb-node base image..."; \
	python -m http.server 9999 --directory . & \
	sleep 1; \
	docker run --rm \
		--add-host host.docker.internal:host-gateway \
		-p 8000:8000 \
		-e BUNDLE_URL=http://host.docker.internal:9999/$$BUNDLE \
		ghcr.io/nimblebrain/mcpb-node:20

bump: ## Bump version across all files (usage: make bump VERSION=0.2.0)
	@if [ -z "$(VERSION)" ]; then echo "Usage: make bump VERSION=x.y.z"; exit 1; fi
	@echo "Bumping version to $(VERSION)..."
	@jq --arg v "$(VERSION)" '.version = $$v' manifest.json > manifest.tmp.json && mv manifest.tmp.json manifest.json
	@jq --arg v "$(VERSION)" '.version = $$v' package.json > package.tmp.json && mv package.tmp.json package.json
	@sed -i '' "s/export const VERSION = '.*'/export const VERSION = '$(VERSION)'/" src/constants.ts
	@echo "Updated:"
	@echo "  manifest.json:    $$(jq -r .version manifest.json)"
	@echo "  package.json:     $$(jq -r .version package.json)"
	@echo "  src/constants.ts: $$(grep 'VERSION' src/constants.ts)"
