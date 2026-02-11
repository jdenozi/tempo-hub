# 12 — Docker + Deployment

## Overview

Multi-stage Docker build for production, docker-compose with Traefik reverse proxy for automatic HTTPS, and storage quota management per client.

## Architecture

```
┌───────────┐     ┌──────────────┐     ┌─────────────┐
│  Internet │────▶│   Traefik    │────▶│   Nuxt App  │
│           │     │  :80 / :443  │     │    :3000    │
└───────────┘     └──────────────┘     └─────────────┘
                   Auto SSL (Let's Encrypt)
```

## Dockerfile

Three-stage build for minimal production image:

1. **deps** — Install dependencies only (cached layer)
2. **builder** — Build the Nuxt app (`npm run build`)
3. **runner** — Copy `.output/` only, run as non-root user

Final image contains only the production server (~150MB vs ~1GB for full node_modules).

## Docker Compose

### Services

- **app** — Nuxt production server with Traefik labels for routing
- **traefik** — Reverse proxy with automatic Let's Encrypt certificates

### Configuration

All settings via `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
# Edit values:
APP_NAME=my-client-site
DOMAIN=client-site.com
ACME_EMAIL=admin@client-site.com
UPLOADS_PATH=./data/uploads
STORAGE_QUOTA_MB=500
```

### Deployment

```bash
# Create the external network (once per server)
docker network create web

# Create uploads directory
mkdir -p data/uploads

# Build and start
docker compose up -d --build

# Check logs
docker compose logs -f app
```

### Multi-client setup

For multiple clients on the same server, each client gets their own `docker-compose.yml` with unique `APP_NAME` and `DOMAIN`. They all share the Traefik instance via the `web` network.

Run Traefik separately:
```bash
# traefik-compose.yml (standalone)
docker compose -f traefik-compose.yml up -d
```

Then each client's compose file only needs the `app` service (remove the `traefik` service block).

## Storage Quotas

The `scripts/check-quota.sh` script monitors upload directory size:

```bash
# Check with defaults (from .env)
./scripts/check-quota.sh

# Check with custom values
./scripts/check-quota.sh ./data/uploads 500
```

**Exit codes:**
- `0` — OK (or warning at 80%)
- `1` — Quota exceeded

Can be added to a cron job:
```bash
# Check every hour
0 * * * * /path/to/project/scripts/check-quota.sh >> /var/log/quota.log 2>&1
```

## Resource Limits

Default limits per container (adjustable in docker-compose.yml):
- **Memory:** 512MB
- **CPU:** 0.5 cores

## Volumes

- **uploads** — Persistent storage for CMS-uploaded images, bound to host directory
- **letsencrypt** — SSL certificates storage
