/**
 * T30 — Orchestrator: run all migration scripts in order.
 *
 * Usage:
 *   STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=xxx npx tsx scripts/migrate-all.ts
 *
 * Order: settings → pages → blog
 * Each script is idempotent — safe to re-run.
 */

import { getStrapiUrl } from './strapi-client.js'
import { migrateSettings } from './migrate-settings.js'
import { migratePages } from './migrate-pages.js'
import { migrateBlog } from './migrate-blog.js'

async function main() {
  const url = getStrapiUrl()
  console.log(`🚀 Starting full content migration to ${url}\n`)

  if (!process.env.STRAPI_TOKEN) {
    console.warn('⚠️  STRAPI_TOKEN not set — requests may fail if auth is required.\n')
  }

  // 1. Settings first (singleton, no dependencies)
  await migrateSettings()
  console.log()

  // 2. Pages (dynamic zone sections)
  await migratePages()
  console.log()

  // 3. Blog articles
  await migrateBlog()

  console.log('\n✨ Migration complete!')
  console.log(`   Verify in Strapi admin → ${url}/admin`)
}

main().catch((err) => {
  console.error('\n💥 Migration failed:', err)
  process.exit(1)
})
