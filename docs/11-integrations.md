# 11 — Integrations (Cal.com + Contact + n8n)

## Overview

Integration components for booking (Cal.com), contact form submission (via server API), and workflow automation (n8n webhooks).

## Components

### `CalEmbed.vue` (`components/integrations/`)

Dynamically loads the Cal.com embed script and renders an inline booking widget.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | config value | Cal.com username |
| `eventSlug` | `string` | config value | Event type slug |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Widget theme |
| `hideEventTypeDetails` | `boolean` | `false` | Hide event details |

Falls back to `app.config.ts` values (`calcom.username`, `calcom.defaultEvent`) if props aren't set. The Cal.com script is loaded lazily on mount — no impact on initial page load.

### `ContactForm.vue` (`components/integrations/`)

Reusable contact form with i18n labels. Submits to `/api/contact` server route.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showPhone` | `boolean` | `true` | Show phone field |

Uses translation keys from `contact.*` namespace for all labels, placeholders, and status messages.

### `SectionContact.vue` (updated)

Now composes `ContactForm` and `CalEmbed` components. If `calcom.username` is configured, the booking widget appears alongside the contact info.

## Server API

### `POST /api/contact`

Server-side endpoint (`server/api/contact.post.ts`) that:

1. **Validates** required fields (name, email, message) and email format
2. **Forwards** the payload to the n8n webhook URL if configured
3. **Logs** to server console if no webhook is set (dev fallback)

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+33 6 12 34 56 78",
  "message": "Hello!"
}
```

**Response:** `{ "success": true }`

**Error codes:**
- `400` — Missing required fields or invalid email
- `502` — Webhook forwarding failed

## Configuration

All integration settings are in `app.config.ts`:

```typescript
calcom: {
  username: 'your-calcom-username',  // Leave empty to disable
  defaultEvent: 'consultation',
},
n8n: {
  webhookContact: 'https://n8n.example.com/webhook/xxx',  // Leave empty for console logging
},
```

## Usage

```vue
<!-- Standalone Cal.com booking widget -->
<IntegrationsCalEmbed username="john" event-slug="30min" />

<!-- Standalone contact form -->
<IntegrationsContactForm />

<!-- Full contact section (info + form + optional Cal.com) -->
<SectionsSectionContact title="Contact us" />
```
