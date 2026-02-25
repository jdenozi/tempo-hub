import { test, expect } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASELINE_DIR = join(__dirname, 'screenshots', 'baseline')

// Ensure baseline directory exists
if (!existsSync(BASELINE_DIR)) {
  mkdirSync(BASELINE_DIR, { recursive: true })
}

const SCROLL_POSITIONS = [
  { name: 'scene-1', scroll: 0, label: '0% scroll (top)' },
  { name: 'scene-2', scroll: 0.33, label: '33% scroll' },
  { name: 'scene-3', scroll: 0.66, label: '66% scroll' },
  { name: 'scene-4', scroll: 1, label: '100% scroll (bottom)' },
]

test.describe('ParallaxHome visual regression baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page and wait for full load
    await page.goto('/', { waitUntil: 'networkidle' })

    // Wait for GSAP/ScrollTrigger to initialize
    await page.waitForTimeout(2000)
  })

  for (const position of SCROLL_POSITIONS) {
    test(`capture baseline screenshot at ${position.label}`, async ({ page }) => {
      // Scroll to the target position
      await page.evaluate((scrollFraction) => {
        window.scrollTo(0, document.body.scrollHeight * scrollFraction)
      }, position.scroll)

      // Wait for GSAP ScrollTrigger animations to settle
      await page.waitForTimeout(1000)

      // Capture full-page screenshot at this scroll position
      const screenshotPath = join(BASELINE_DIR, `${position.name}.png`)
      await page.screenshot({
        path: screenshotPath,
        fullPage: false, // Capture viewport only (not full page)
      })

      // Verify the screenshot was created
      expect(existsSync(screenshotPath)).toBe(true)
    })
  }
})
