/**
 * Visual-regression gate: asserts no horizontal overflow on the key pages at
 * phone/tablet/desktop widths. Run against a local server:
 *
 *   node scripts/check-viewport-overflow.mjs [baseUrl]
 *
 * Exits non-zero if any page scrolls horizontally.
 */
import { chromium } from '@playwright/test'

const baseUrl = process.argv[2] ?? 'http://localhost:3000'

const pages = [
  '/',
  '/foundation',
  '/getting-started',
  '/about',
  '/docs/Next/components',
  '/docs/Next/components/inputs/button',
  '/docs/Next/foundation/accessibility',
  '/docs/components/inputs/button', // archived 1.1.0 — must also stay clean
]

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]

const browser = await chromium.launch()
const page = await browser.newPage()
let failures = 0

for (const viewport of viewports) {
  await page.setViewportSize(viewport)
  for (const path of pages) {
    await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
    const { docW, vw } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    }))
    const ok = docW <= vw
    if (!ok) failures++
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${String(viewport.width).padStart(4)}px ${path}` +
        (ok ? '' : ` — scrollWidth ${docW} > viewport ${vw}`),
    )
  }
}

await browser.close()
if (failures > 0) {
  console.error(`\n${failures} page/viewport combinations overflow`)
  process.exit(1)
}
console.log('\nAll pages fit their viewport.')
