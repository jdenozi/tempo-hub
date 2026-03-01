#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───
REPO_URL="git@github.com:jdenozi/tempo-hub.git"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

# ─── Usage ───
usage() {
  echo "Usage: $0 <version>"
  echo ""
  echo "  <version>  Tag, branch or commit to deploy (e.g. v1.0.0, main, ada0d09)"
  echo ""
  echo "Examples:"
  echo "  $0 v1.2.0        # Deploy tag v1.2.0"
  echo "  $0 main          # Deploy latest main"
  echo "  $0 abc1234       # Deploy specific commit"
  exit 1
}

# ─── Validate args ───
if [ $# -lt 1 ]; then
  usage
fi

VERSION="$1"

echo "╔══════════════════════════════════════╗"
echo "║  Tempo Hub — Deploy                 ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "  Version:   $VERSION"
echo "  Directory: $APP_DIR"
echo ""

# ─── Fetch latest from GitHub ───
echo "→ Fetching latest from origin..."
cd "$APP_DIR"
git fetch origin --tags --prune

# ─── Checkout requested version ───
echo "→ Checking out $VERSION..."
git checkout "$VERSION"

# ─── Update submodules ───
echo "→ Updating submodules..."
git submodule update --init --recursive

# ─── Rebuild and restart containers ───
echo "→ Building and restarting containers..."
docker compose down
docker compose build --no-cache
docker compose up -d

# ─── Verify ───
echo ""
echo "→ Waiting for container to start..."
sleep 3

if docker compose ps | grep -q "running"; then
  echo ""
  echo "✓ Deploy complete — $VERSION is live"
  echo ""
  docker compose ps
else
  echo ""
  echo "✗ Container failed to start. Check logs:"
  echo "  docker compose logs -f"
  exit 1
fi
