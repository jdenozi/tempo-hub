/**
 * T28 — Migrate general.json → Strapi site-setting singleton.
 *
 * Flattens the nested JSON structure to match the flat Strapi schema.
 * Handles both create (first run) and update (subsequent runs).
 *
 * Idempotent: updates existing singleton if already present.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { strapiFind, strapiCreate, strapiUpdate } from './strapi-client.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SETTINGS_PATH = path.resolve(__dirname, '../content/settings/general.json')

export async function migrateSettings() {
  console.log('⚙️  Migrating site settings...')

  if (!fs.existsSync(SETTINGS_PATH)) {
    console.error(`❌ Settings file not found: ${SETTINGS_PATH}`)
    return
  }

  const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'))

  // Flatten nested JSON to match Strapi's flat site-setting schema
  const flatSettings: Record<string, any> = {
    // identity
    siteName: settings.identity?.siteName || 'Tempo Hub',
    profession: settings.identity?.profession || '',
    // contact
    email: settings.contact?.email || '',
    phone: settings.contact?.phone || '',
    address: settings.contact?.address || '',
    city: settings.contact?.city || '',
    zipCode: settings.contact?.zipCode || '',
    country: settings.contact?.country || 'France',
    // social
    instagram: settings.social?.instagram || '',
    facebook: settings.social?.facebook || '',
    linkedin: settings.social?.linkedin || '',
    twitter: settings.social?.twitter || '',
    youtube: settings.social?.youtube || '',
    github: settings.social?.github || '',
    // seo
    defaultTitle: settings.seo?.defaultTitle || '',
    defaultDescription: settings.seo?.defaultDescription || '',
    googleAnalytics: settings.seo?.googleAnalytics || '',
    // appearance
    primaryColor: settings.appearance?.primaryColor || '#d4a853',
    secondaryColor: settings.appearance?.secondaryColor || '#1a1a2e',
    headingFont: settings.appearance?.headingFont || 'Space Grotesk',
    bodyFont: settings.appearance?.bodyFont || 'Inter',
    // features
    scrollAnimations: settings.features?.scrollAnimations ?? true,
    customCursor: settings.features?.customCursor ?? true,
    cookieBanner: settings.features?.cookieBanner ?? true,
    maintenanceMode: settings.features?.maintenanceMode ?? false,
    maintenanceMessage: settings.features?.maintenanceMessage || '',
  }

  try {
    // Strapi singleType: GET returns the single entry or 404
    const existing = await strapiFind('site-setting')

    if (existing.data?.documentId) {
      await strapiUpdate('site-setting', existing.data.documentId, flatSettings)
      console.log('  ✅ Settings updated')
    } else {
      await strapiCreate('site-setting', flatSettings)
      console.log('  ✅ Settings created')
    }
  } catch {
    // If GET failed (no entry yet), try create
    try {
      await strapiCreate('site-setting', flatSettings)
      console.log('  ✅ Settings created')
    } catch (err) {
      console.error('  ❌ Settings migration failed:', err instanceof Error ? err.message : err)
    }
  }
}

// Run directly when not imported by orchestrator
const isDirectRun = process.argv[1]?.includes('migrate-settings')
if (isDirectRun) migrateSettings()
