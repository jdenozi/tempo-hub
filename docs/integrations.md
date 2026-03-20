# Integrations Guide

This guide covers the three external services used in Tempo Hub: Cal.com for booking, n8n for contact form automation, and Strapi as the headless CMS. It also covers deploying the full stack.

---

## 1. Cal.com (Booking)

**What it does**: Embeds a Cal.com booking widget in the Contact section and any page where `CalEmbed` is used. The widget loads lazily — no impact on initial page performance.

### Setup

1. Create a [Cal.com](https://cal.com) account
2. Set up your event type (e.g., "30min consultation") and note the event slug
3. Configure in `app.config.ts`:

```ts
calcom: {
  username: 'your-cal-username',   // Your Cal.com username
  defaultEvent: 'consultation',    // Event slug from your Cal.com dashboard
}
```

4. The `CalEmbed` component auto-activates in `SectionContact` when `calcom.username` is set. Leave it empty to disable the widget entirely.

### Component usage

```vue
<!-- Uses app.config defaults -->
<IntegrationsCalEmbed />

<!-- Override per-instance -->
<IntegrationsCalEmbed username="other-user" event-slug="30min" />
```

The component falls back to `app.config.ts` values (`calcom.username`, `calcom.defaultEvent`) when props aren't passed. The Cal.com script is loaded dynamically on mount, so it won't block your page.

### Disabling Cal.com

Leave `calcom.username` empty (or remove the key). The booking widget won't render, and `SectionContact` will show only the contact form.

---

## 2. n8n (Contact Form Webhook)

**What it does**: When a user submits the contact form, the server API at `/api/contact` forwards the data to your n8n webhook URL. From there, n8n can send emails, create CRM records, notify Slack, or trigger any automation you need.

### Setup

1. Set up your n8n instance (self-hosted or cloud)
2. Create a new workflow with an **HTTP Trigger** node
3. Copy the webhook URL from the trigger node
4. Add it to `app.config.ts`:

```ts
n8n: {
  webhookContact: 'https://your-n8n.com/webhook/contact-form',
}
```

### Data sent to n8n

The server POSTs this JSON payload to your webhook:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello...",
  "source": "contact-form"
}
```

The `phone` field is also included when the user fills it in.

### Fallback behavior

If `webhookContact` is empty, the contact form still works. Submissions are logged to the server console instead. This is useful during development or when you haven't set up n8n yet.

The API always returns `{ "success": true }` to the user regardless of webhook status, so the form experience is never broken by a missing or failing webhook.

### Testing your webhook

You can test the integration without a real form submission using curl:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

Check your n8n workflow execution log to confirm the payload arrived.

---

## 3. Strapi CMS Setup

**What it does**: Strapi is the headless CMS that powers all page content — sections, blog articles, and site settings. The Nuxt frontend fetches content from Strapi at build time and on-demand via the REST API.

### Initial Setup

1. Start Strapi with Docker:

```bash
docker compose up strapi postgres -d
```

2. Wait for Strapi to finish building on first run (roughly 2 minutes). Watch the logs:

```bash
docker logs -f <app>-strapi
```

3. Open the Strapi admin panel: `http://localhost:1337/admin`

4. Create your first admin account when prompted.

5. **Create an API Token** so the Nuxt frontend can read content:
   - Go to **Settings → API Tokens → Create new API Token**
   - Name: `nuxt-frontend`
   - Type: **Full access**
   - Duration: **Unlimited**
   - Click **Save** and copy the token immediately (it won't be shown again)

6. **Set Content Permissions** so public routes work:
   - Go to **Settings → Users & Permissions → Roles → Public**
   - Enable **find** and **findOne** for: Pages, Blog Articles, Site Setting
   - Click **Save**

### Environment Variables

Add these to your `.env` file:

```bash
# URL Strapi uses to serve content
NUXT_PUBLIC_STRAPI_URL=https://your-domain.com   # or http://strapi:1337 inside Docker

# API token for server-side requests (from step 5 above)
STRAPI_TOKEN=your_api_token_here
```

In production, `NUXT_PUBLIC_STRAPI_URL` should be your public domain, not `localhost`. Inside Docker Compose, the Nuxt app can reach Strapi at `http://strapi:1337` for server-side requests.

### Creating Content

Once Strapi is running and permissions are set:

- **Site Settings**: Content Manager → Site Setting → Edit (fill in company info, social links, enabled features)
- **Pages**: Content Manager → Pages → Create Entry (add sections via the Dynamic Zone field)
- **Blog Articles**: Content Manager → Blog Articles → Create Entry

Each page uses a Dynamic Zone where you pick and configure sections (hero, features, pricing, testimonials, FAQ, CTA, contact, stats, logos). The Nuxt frontend renders them automatically via `PageRenderer`.

### Strapi Upgrades

Before upgrading Strapi, always back up your database and uploads volume:

```bash
docker exec <app>-postgres pg_dump -U strapi strapi > backup-$(date +%Y%m%d).sql
```

---

## 4. Deployment

**Stack**: Nuxt app + Strapi + PostgreSQL, all behind a Traefik reverse proxy with automatic SSL.

### Prerequisites

- A server with Docker and Docker Compose installed
- Traefik running with an external `web` network
- DNS A record pointing your domain to the server

### First Deploy

1. Clone the repo on the server:

```bash
git clone --recurse-submodules git@github.com:jdenozi/tempo-hub.git
cd tempo-hub
```

2. Copy the example env file and fill in all values:

```bash
cp .env.example .env
nano .env
```

3. Run the deploy script:

```bash
./deploy.sh main
```

This pulls the image, runs migrations, and starts all services.

### Subsequent Deploys

Tag a release locally, then run the deploy script on the server:

```bash
# On your local machine:
git tag v1.2.3 -m "Release message"
git push origin v1.2.3

# On the server:
./deploy.sh v1.2.3
```

### Key Environment Variables

See `.env.example` for the full list. The critical ones:

| Variable | Description |
|---|---|
| `DOMAIN` | Your domain (e.g., `mysite.com`) |
| `APP_NAME` | Container name prefix for all services |
| `DATABASE_PASSWORD` | PostgreSQL password — change from the default! |
| `NUXT_PUBLIC_STRAPI_URL` | Set to `https://your-domain.com` in production |
| `STRAPI_TOKEN` | API token from Strapi admin (see section 3) |
| `ENCRYPTION_KEY` | Strapi encryption key — generate with `openssl rand -base64 32` |
| `ACME_EMAIL` | Email for Let's Encrypt SSL certificate |

### Traefik Routing

The `docker-compose.yml` configures Traefik labels automatically:

- `/admin` and `/api` routes go to the Strapi container
- Everything else goes to the Nuxt app
- SSL is handled by Traefik via Let's Encrypt

You don't need to configure Traefik manually — the labels in `docker-compose.yml` handle it.

### Data Persistence

PostgreSQL data and Strapi uploads are stored in named Docker volumes. They survive container restarts and image updates.

Always back up before major updates:

```bash
# Database
docker exec <app>-postgres pg_dump -U strapi strapi > backup.sql

# Uploads
docker cp <app>-strapi:/app/public/uploads ./uploads-backup
```

### Health Checks

After deploying, verify everything is up:

```bash
# Check all containers are running
docker compose ps

# Check Nuxt is responding
curl -I https://your-domain.com

# Check Strapi admin is accessible
curl -I https://your-domain.com/admin
```

If Strapi takes a moment to start, the Nuxt app will retry automatically. Give it 30 seconds on first boot.

---

## Quick Reference

| Service | Local URL | Production URL |
|---|---|---|
| Nuxt frontend | `http://localhost:3000` | `https://your-domain.com` |
| Strapi admin | `http://localhost:1337/admin` | `https://your-domain.com/admin` |
| Strapi API | `http://localhost:1337/api` | `https://your-domain.com/api` |

| Config key | File | Purpose |
|---|---|---|
| `calcom.username` | `app.config.ts` | Cal.com username (empty = disabled) |
| `calcom.defaultEvent` | `app.config.ts` | Default event slug |
| `n8n.webhookContact` | `app.config.ts` | n8n webhook URL (empty = console log) |
| `STRAPI_TOKEN` | `.env` | Server-side API token |
| `NUXT_PUBLIC_STRAPI_URL` | `.env` | Strapi base URL |
