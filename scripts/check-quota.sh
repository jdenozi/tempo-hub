#!/bin/bash
# Check storage usage for a client's uploads directory.
# Usage: ./scripts/check-quota.sh [uploads_path] [quota_mb]

UPLOADS_PATH="${1:-./data/uploads}"
QUOTA_MB="${2:-${STORAGE_QUOTA_MB:-500}}"

if [ ! -d "$UPLOADS_PATH" ]; then
  echo "Uploads directory does not exist: $UPLOADS_PATH"
  exit 0
fi

# Calculate current usage in MB
USAGE_KB=$(du -s "$UPLOADS_PATH" 2>/dev/null | cut -f1)
USAGE_MB=$((USAGE_KB / 1024))
QUOTA_KB=$((QUOTA_MB * 1024))

echo "Storage usage: ${USAGE_MB}MB / ${QUOTA_MB}MB"

if [ "$USAGE_KB" -ge "$QUOTA_KB" ]; then
  echo "WARNING: Storage quota exceeded!"
  exit 1
fi

# Warn at 80% usage
WARN_KB=$((QUOTA_KB * 80 / 100))
if [ "$USAGE_KB" -ge "$WARN_KB" ]; then
  echo "WARNING: Storage usage above 80%"
  exit 0
fi

echo "OK"
