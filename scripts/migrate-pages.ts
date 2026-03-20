/**
 * T25 — Migrate MDC page content → Strapi Dynamic Zone entries.
 *
 * Parses ::section-xxx blocks from markdown files, converts YAML props
 * to Strapi component format, and creates pages via REST API.
 *
 * Idempotent: checks slug before creating, skips duplicates.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { strapiFind, strapiCreate, strapiUpdate, uploadImage } from './strapi-client.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = path.resolve(__dirname, '../content/fr/pages')
const PUBLIC_DIR = path.resolve(__dirname, '../public')
const FORCE = process.argv.includes('--force')

// ---------------------------------------------------------------------------
// Valid Strapi attributes per section component (from schema.json files).
// Any MDC prop NOT listed here is stripped (e.g. `animation`).
// ---------------------------------------------------------------------------
const SECTION_ALLOWED_ATTRS: Record<string, Set<string>> = {
  'page-banner': new Set(['title', 'subtitle', 'ctaText', 'ctaLink', 'secondaryCtaText', 'secondaryCtaLink', 'size', 'heroPreset']),
  'features': new Set(['title', 'subtitle', 'items']),
  'pricing': new Set(['title', 'subtitle', 'columns', 'plans']),
  'cta': new Set(['title', 'subtitle', 'ctaText', 'ctaLink', 'secondaryCtaText', 'secondaryCtaLink']),
  'faq': new Set(['title', 'subtitle', 'items']),
  'stats': new Set(['items']),
  'contact': new Set(['title', 'subtitle']),
  'booking': new Set(['title', 'subtitle', 'theme']),
  'projects': new Set(['title', 'subtitle', 'showAll', 'items']),
}

// ---------------------------------------------------------------------------
// MDC parser
// ---------------------------------------------------------------------------

interface MdcSection {
  name: string
  props: Record<string, any>
}

/**
 * Parse MDC section blocks from markdown content.
 *
 * Handles the format:
 *   ::section-xxx
 *   ---
 *   yaml props
 *   ---
 *   ::
 *
 * Also handles sections without YAML props:
 *   ::section-xxx
 *   ::
 */
function parseMdcSections(content: string): MdcSection[] {
  const sections: MdcSection[] = []

  // Match ::section-<name>\n---\n<yaml>\n---\n::
  const sectionRegex = /::section-([\w-]+)\n---\n([\s\S]*?)\n---\n::/g

  let match
  while ((match = sectionRegex.exec(content)) !== null) {
    const name = match[1]
    const yamlContent = match[2]

    let props: Record<string, any> = {}
    try {
      props = (yaml.load(yamlContent) as Record<string, any>) || {}
    } catch (e) {
      console.warn(`⚠️  Failed to parse YAML in section-${name}, skipping props`)
    }

    sections.push({ name, props })
  }

  return sections
}

// ---------------------------------------------------------------------------
// Section → Strapi component mappers
// ---------------------------------------------------------------------------

/** Strip props not in the Strapi schema for a given section type. */
function stripUnknownProps(sectionName: string, props: Record<string, any>): Record<string, any> {
  const allowed = SECTION_ALLOWED_ATTRS[sectionName]
  if (!allowed) return props

  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(props)) {
    if (allowed.has(key)) {
      cleaned[key] = value
    }
  }
  return cleaned
}

/** Map feature items to shared.feature-item shape. */
function mapFeatureItems(items: any[]): any[] {
  return items.map((item) => ({
    icon: item.icon || '',
    title: item.title,
    description: item.description,
  }))
}

/** Map pricing plans to shared.pricing-plan shape. Features → JSON array. */
function mapPricingPlans(plans: any[]): any[] {
  return plans.map((plan) => ({
    name: plan.name,
    price: plan.price,
    period: plan.period || '',
    description: plan.description || '',
    features: plan.features || [], // json type in Strapi — stored as array
    ctaText: plan.ctaText || '',
    ctaLink: plan.ctaLink || '',
    highlighted: plan.highlighted || false,
  }))
}

/** Map FAQ items to shared.faq-item shape. */
function mapFaqItems(items: any[]): any[] {
  return items.map((item) => ({
    question: item.question,
    answer: item.answer,
  }))
}

/** Map stat items to shared.stat-item shape. */
function mapStatItems(items: any[]): any[] {
  return items.map((item) => ({
    value: String(item.value),
    label: item.label,
  }))
}

/** Map project items — upload images to Strapi media library. */
async function mapProjectItems(items: any[]): Promise<any[]> {
  return Promise.all(
    items.map(async (item) => {
      const result: Record<string, any> = {
        title: item.title || '',
        description: item.description || '',
        tags: item.tags || null,
        link: item.link || '',
      }
      const imageArray: string[] = item.images || (item.image ? [item.image] : [])
      const uploadedIds: number[] = []
      for (const imgSrc of imageArray) {
        const rel = imgSrc.startsWith('/') ? imgSrc.slice(1) : imgSrc
        const fullPath = path.join(PUBLIC_DIR, rel)
        if (fs.existsSync(fullPath)) {
          try {
            const media = await uploadImage(fullPath)
            uploadedIds.push(media.id)
          } catch (err) {
            console.warn(`  ⚠️  Image upload failed: ${imgSrc}`, err instanceof Error ? err.message : err)
          }
        } else {
          console.warn(`  ⚠️  Image not found: ${fullPath}`)
        }
      }
      if (uploadedIds.length > 0) result.image = uploadedIds[0]
      if (uploadedIds.length > 1) result.images = uploadedIds.slice(1)
      return result
    }),
  )
}

/**
 * Build a Strapi Dynamic Zone entry from a parsed MDC section.
 * Returns the component object with __component set.
 */
async function buildStrapiSection(section: MdcSection): Promise<Record<string, any> | null> {
  const { name, props } = section
  const { animation, ...propsWithoutAnimation } = props
  const cleaned = stripUnknownProps(name, propsWithoutAnimation)

  switch (name) {
    case 'features':
      if (cleaned.items) cleaned.items = mapFeatureItems(cleaned.items)
      break
    case 'pricing':
      if (cleaned.plans) cleaned.plans = mapPricingPlans(cleaned.plans)
      break
    case 'faq':
      if (cleaned.items) cleaned.items = mapFaqItems(cleaned.items)
      break
    case 'stats':
      if (cleaned.items) cleaned.items = mapStatItems(cleaned.items)
      break
    case 'projects':
      if (cleaned.items && Array.isArray(cleaned.items)) {
        cleaned.items = await mapProjectItems(cleaned.items)
      }
      if (cleaned.showAll === undefined) cleaned.showAll = true
      break
  }

  return {
    __component: `sections.${name}`,
    ...(animation ? { animation } : {}),
    ...cleaned,
  }
}

// ---------------------------------------------------------------------------
// Main migration
// ---------------------------------------------------------------------------

export async function migratePages() {
  console.log('📄 Migrating pages...')

  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Pages directory not found: ${PAGES_DIR}`)
    return
  }

  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.md'))
  let created = 0
  let skipped = 0
  let failed = 0

  for (const file of files) {
    const slug = file.replace('.md', '')
    const filePath = path.join(PAGES_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(raw)

    // Parse MDC sections from body
    const mdcSections = parseMdcSections(content)
    const strapiSections = (
      await Promise.all(mdcSections.map(buildStrapiSection))
    ).filter((s): s is Record<string, any> => s !== null)

    const pageData: Record<string, any> = {
      title: frontmatter.title,
      slug,
      description: frontmatter.description || '',
      navLabel: frontmatter.navLabel || '',
      order: frontmatter.order ?? 0,
      showInNav: frontmatter.showInNav !== false,
      heroPreset: frontmatter.heroPreset || 'none',
      sections: strapiSections,
      publishedAt: new Date().toISOString(),
    }

    try {
      const existing = await strapiFind('pages', { slug })
      if (existing.data?.length > 0) {
        if (FORCE) {
          const documentId = existing.data[0].documentId
          await strapiUpdate('pages', documentId, pageData)
          console.log(`  🔄 Updated ${slug} (${strapiSections.length} sections)`)
        } else {
          console.log(`  ⏭️  Skip ${slug} (already exists)`)
          skipped++
        }
        continue
      }
    } catch {
      // If API call fails (e.g. 404), continue with creation
    }

    try {
      await strapiCreate('pages', pageData)
      console.log(`  ✅ ${slug} (${strapiSections.length} sections)`)
      created++
    } catch (err) {
      console.error(`  ❌ ${slug}:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log(`\n  Pages: ${created} created, ${skipped} skipped, ${failed} failed`)
}

// Run directly when not imported by orchestrator
const isDirectRun = process.argv[1]?.includes('migrate-pages')
if (isDirectRun) migratePages()
