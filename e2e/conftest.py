"""E2E test configuration and fixtures."""

from pathlib import Path

# Test configuration
BASE_IMAGE = "ghcr.io/nimblebrain/mcpb-node:20"
CONTAINER_PORT = 8000
BUNDLE_NAME = "nimblebraininc-nationalparks"

PROJECT_ROOT = Path(__file__).parent.parent
