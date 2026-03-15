# Deployment Guide — Tempo Hub

## Prerequisites

- VPS with Docker + Docker Compose installed
- Domain configured (DNS A record → VPS IP)
- Traefik running as reverse proxy (on the `web` Docker network)

## Quick Start

### 1. Clone and configure

```bash
git clone --recurse-submodules git@github.com:jdenozi/tempo-hub.git
cd tempo-hub
cp .env.example .env
```

### 2. Generate secrets

```bash
# Generate all required secrets
node -e "
const crypto = require('crypto');
const gen = () => crypto.randomBytes(16).toString('base64');
console.log('APP_KEYS=' + Array.from({length:4}, gen).join(','));
console.log('API_TOKEN_SALT=' + gen());
console.log('ADMIN_JWT_SECRET=' + gen());
console.log('TRANSFER_TOKEN_SALT=' + gen());
console.log('JWT_SECRET=' + gen());
console.log('DATABASE_PASSWORD=' + crypto.randomBytes(24).toString('hex'));
"
```

Copy the output into `.env`.

### 3. Configure domain

In `.env`:
```env
DOMAIN=tempo-hub.fr
APP_NAME=tempo-hub
PUBLIC_URL=https://tempo-hub.fr
```

### 4. Start the stack

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** — Database (internal only, healthcheck-gated)
- **Strapi** — CMS admin at `https://your-domain.fr/admin`
- **Nuxt** — Frontend at `https://your-domain.fr`

### 5. Initial setup

1. Open `https://your-domain.fr/admin`
2. Create the first admin account
3. Create an API token: Settings → API Tokens → Create (Full access)
4. Run content seed:

```bash
export STRAPI_URL=http://localhost:1337
export STRAPI_TOKEN=your_token_here
npx tsx scripts/seed-content.ts
```

### 6. For existing site migration

```bash
export STRAPI_URL=http://localhost:1337
export STRAPI_TOKEN=your_token_here
npx tsx scripts/migrate-all.ts
```

See `scripts/README.md` for migration details.

## Architecture

```
Internet → Traefik → /admin, /uploads → Strapi (:1337)  [priority 20]
                   → /*               → Nuxt   (:3000)  [priority 10]

Docker internal: Nuxt → Strapi (:1337) [SSR data fetching via NUXT_PUBLIC_STRAPI_URL]
                 Strapi → PostgreSQL (:5432)
```

### Resource Limits

| Service    | Memory | CPU  |
|------------|--------|------|
| Nuxt       | 512M   | 0.5  |
| Strapi     | 768M   | 0.5  |
| PostgreSQL | 256M   | 0.25 |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_NAME` | Yes | Container name prefix (e.g. `tempo-hub`) |
| `DOMAIN` | Yes | Production domain (e.g. `tempo-hub.fr`) |
| `PUBLIC_URL` | Yes | Full public URL for Strapi (e.g. `https://tempo-hub.fr`) |
| `APP_KEYS` | Yes | Strapi app keys (4 comma-separated base64 values) |
| `API_TOKEN_SALT` | Yes | Strapi API token salt |
| `ADMIN_JWT_SECRET` | Yes | Strapi admin JWT secret |
| `TRANSFER_TOKEN_SALT` | Yes | Strapi transfer token salt |
| `JWT_SECRET` | Yes | Strapi JWT secret |
| `DATABASE_PASSWORD` | Yes | PostgreSQL password |
| `DATABASE_NAME` | No | Database name (default: `strapi`) |
| `DATABASE_USERNAME` | No | Database user (default: `strapi`) |
| `UPLOADS_PATH` | No | Host path for uploads (default: `./data/uploads`) |
| `STORAGE_QUOTA_MB` | No | Upload quota in MB (default: `500`) |
| `ACME_EMAIL` | No | Email for Let's Encrypt SSL certificates |

## Maintenance

### Backup database
```bash
docker compose exec postgres pg_dump -U strapi strapi > backup-$(date +%Y%m%d).sql
```

### Restore database
```bash
docker compose exec -i postgres psql -U strapi strapi < backup-YYYYMMDD.sql
```

### Backup uploads
```bash
docker compose cp strapi:/opt/app/public/uploads ./backup-uploads-$(date +%Y%m%d)
```

### Update Strapi
```bash
cd strapi && npm update @strapi/strapi && cd ..
docker compose build strapi && docker compose up -d strapi
```

### Update Nuxt
```bash
npm update
docker compose build app && docker compose up -d app
```

### Update tempo-core submodule
```bash
git submodule update --remote
git add tempo-core
git commit -m "update: tempo-core to latest"
docker compose build app && docker compose up -d app
```

### View logs
```bash
docker compose logs -f          # All services
docker compose logs -f strapi   # Strapi only
docker compose logs -f app      # Nuxt only
```

## Troubleshooting

### Strapi won't start
1. Check PostgreSQL is healthy: `docker compose ps postgres`
2. Check logs: `docker compose logs strapi`
3. Verify `DATABASE_PASSWORD` matches in `.env`

### Nuxt can't reach Strapi
- Nuxt connects to Strapi via internal Docker network (`http://strapi:1337`)
- Ensure both are on the `internal` network (default in docker-compose)

### SSL not working
- Verify Traefik is running on the `web` network
- Check DNS A record points to VPS IP
- Check `DOMAIN` in `.env` matches your DNS

## Client Guide

Donnez à vos clients l'URL `/admin` avec des identifiants Éditeur.
Ils peuvent :
- ✅ Modifier les textes des pages
- ✅ Ajouter/modifier des articles de blog
- ✅ Uploader des images
- ✅ Modifier les paramètres du site (contact, réseaux sociaux)
- ✅ Gérer les projets portfolio
- ❌ Ne PEUVENT PAS modifier le code ou la structure du site
