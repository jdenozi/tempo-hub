/**
 * Cleanup legacy Nuxt Content files after Strapi migration is validated.
 * Run ONLY after confirming all content is served from Strapi.
 *
 * Usage: npx tsx scripts/cleanup-legacy.ts [--dry-run]
 */
import fs from 'fs'
import path from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const ROOT = path.resolve(__dirname, '..')

const filesToRemove = [
  'content/',           // All markdown content (now in Strapi)
  'content.config.ts',  // Nuxt Content collection definitions
]

const modulesToRemove = [
  'nuxt-studio',        // Replaced by Strapi admin
  // Note: @nuxt/content can be removed too, but keep for markdown parsing if needed
]

console.log(DRY_RUN ? '🔍 DRY RUN — no files will be deleted\n' : '🗑️  CLEANUP MODE\n')

// --- File removal ---

let removedCount = 0
let skippedCount = 0

for (const file of filesToRemove) {
  const fullPath = path.join(ROOT, file)
  if (fs.existsSync(fullPath)) {
    if (DRY_RUN) {
      const stat = fs.statSync(fullPath)
      const type = stat.isDirectory() ? 'directory' : 'file'
      console.log(`Would remove (${type}): ${file}`)
    } else {
      fs.rmSync(fullPath, { recursive: true, force: true })
      console.log(`✅ Removed: ${file}`)
    }
    removedCount++
  } else {
    console.log(`⏭️  Not found: ${file}`)
    skippedCount++
  }
}

// --- Summary ---

console.log(`\n📊 Summary: ${removedCount} to remove, ${skippedCount} not found`)

console.log('\n📝 Manual steps after cleanup:')
console.log('1. Remove from nuxt.config.ts modules: ' + modulesToRemove.join(', '))
console.log('2. npm uninstall nuxt-studio @nuxt/content')
console.log('3. Remove queryCollection fallbacks from pages/[...slug].vue and pages/blog/')
console.log('4. Run: npm run build')
