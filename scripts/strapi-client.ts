/**
 * Strapi REST API client for migration scripts.
 * Usage: STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=xxx npx tsx scripts/migrate-all.ts
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ''

function headers(json = false): Record<string, string> {
  const h: Record<string, string> = {}
  if (STRAPI_TOKEN) h['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  if (json) h['Content-Type'] = 'application/json'
  return h
}

export async function strapiFind(contentType: string, filters?: Record<string, string>) {
  const params = new URLSearchParams()
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      params.append(`filters[${key}][$eq]`, value)
    }
  }
  const url = `${STRAPI_URL}/api/${contentType}?${params}`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`strapiFind ${contentType} failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function strapiCreate(contentType: string, data: Record<string, any>) {
  const res = await fetch(`${STRAPI_URL}/api/${contentType}`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ data }),
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Failed to create ${contentType}: ${res.status} ${error}`)
  }
  return res.json()
}

export async function strapiUpdate(contentType: string, documentId: string, data: Record<string, any>) {
  const res = await fetch(`${STRAPI_URL}/api/${contentType}/${documentId}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ data }),
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Failed to update ${contentType}/${documentId}: ${res.status} ${error}`)
  }
  return res.json()
}

export function getStrapiUrl() {
  return STRAPI_URL
}
