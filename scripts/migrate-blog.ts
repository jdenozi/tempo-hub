/**
 * T26 — Migrate blog markdown → Strapi rich text entries.
 *
 * Blog articles are simpler: the markdown body is stored as-is
 * in Strapi's richtext field. Frontmatter maps to title/slug/date/author.
 *
 * Idempotent: checks slug before creating, skips duplicates.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { strapiFind, strapiCreate } from './strapi-client.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.resolve(__dirname, '../content/fr/blog')

export async function migrateBlog() {
  console.log('📝 Migrating blog articles...')

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ Blog directory not found: ${BLOG_DIR}`)
    return
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  let created = 0
  let skipped = 0
  let failed = 0

  for (const file of files) {
    const slug = file.replace('.md', '')
    const filePath = path.join(BLOG_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(raw)

    // Idempotent: skip if already exists
    try {
      const existing = await strapiFind('blog-articles', { slug })
      if (existing.data?.length > 0) {
        console.log(`  ⏭️  Skip ${slug} (already exists)`)
        skipped++
        continue
      }
    } catch {
      // Continue with creation if API check fails
    }

    const articleData = {
      title: frontmatter.title,
      slug,
      description: frontmatter.description || '',
      content: content.trim(), // Raw markdown stored in richtext field
      date: frontmatter.date
        ? new Date(frontmatter.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      author: frontmatter.author || 'Tempo Hub',
    }

    try {
      await strapiCreate('blog-articles', articleData)
      console.log(`  ✅ ${slug}`)
      created++
    } catch (err) {
      console.error(`  ❌ ${slug}:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log(`\n  Blog: ${created} created, ${skipped} skipped, ${failed} failed`)
}

// Run directly when not imported by orchestrator
const isDirectRun = process.argv[1]?.includes('migrate-blog')
if (isDirectRun) migrateBlog()
