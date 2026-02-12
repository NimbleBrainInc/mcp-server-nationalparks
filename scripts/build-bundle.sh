#!/usr/bin/env bash
set -euo pipefail

# Build an MCPB bundle locally for a Node.js MCP server.
# Usage: ./scripts/build-bundle.sh [directory] [version]

DIR="${1:-.}"
VERSION="${2:-}"

cd "$DIR"

# Read name from manifest
NAME=$(jq -r '.name' manifest.json)
if [ -z "$NAME" ] || [ "$NAME" = "null" ]; then
  echo "Error: could not read name from manifest.json" >&2
  exit 1
fi

# Determine version: argument > manifest > fallback
if [ -z "$VERSION" ]; then
  VERSION=$(jq -r '.version' manifest.json)
fi
if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
  echo "Error: no version provided and none found in manifest.json" >&2
  exit 1
fi

# Detect OS and arch for the output filename
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  ARCH="amd64" ;;
  aarch64) ARCH="arm64" ;;
  arm64)   ARCH="arm64" ;;
esac

# Sanitize scoped package name (@scope/name -> scope-name) for filename
SAFE_NAME=$(echo "$NAME" | sed 's|^@||; s|/|-|g')
OUTPUT="${SAFE_NAME}-${VERSION}-${OS}-${ARCH}.mcpb"

echo "Building bundle: $OUTPUT"
echo "  name:    $NAME"
echo "  version: $VERSION"
echo "  os:      $OS"
echo "  arch:    $ARCH"

# Install all dependencies (need devDeps for tsc), build, then prune
echo ""
echo "Installing dependencies..."
npm ci

echo ""
echo "Building TypeScript..."
npm run build

echo ""
echo "Pruning dev dependencies from bundle..."
npm prune --omit=dev

# Pack the bundle
echo ""
echo "Packing bundle..."
mcpb pack . "$OUTPUT"

echo ""
echo "Bundle built: $OUTPUT"
ls -lh "$OUTPUT"
