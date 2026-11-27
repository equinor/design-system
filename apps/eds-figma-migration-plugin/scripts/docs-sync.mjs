/**
 * Copies the demo of the window and the images the docs pages use into the
 * docs site, so the pages show the window as it is in this build. Run it
 * with `pnpm run docs:sync`, which builds the demo and takes the images
 * first, and commit the result with the release it belongs to.
 *
 * The docs pages name the steps they show (scripts/docs-steps.mjs). For each
 * of them, in light and dark, the image is scaled to twice the width the
 * docs show it at and saved as WebP. Images in the docs that no page uses
 * any more are removed.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { DOCS_APP, docsSteps } from './docs-steps.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demo = join(root, 'demo/dist/index.html')
const images = join(root, 'demo/dist/images')

const DOCS_DEMO = join(DOCS_APP, 'static/migration-plugin/demo.html')
const DOCS_IMAGES = join(DOCS_APP, 'static/img/migration-plugin')

/**
 * The docs show an image at most 20rem (320px) wide, so it is saved at twice
 * that for sharp text on high-density screens. Keep it in step with
 * `IMAGE_WIDTH` in the docs' MigrationPlugin component.
 */
const WIDTH = 640

/** Lossy WebP at this quality keeps the window's text sharp at a quarter of the PNG size */
const QUALITY = 90

const THEMES = ['light', 'dark']

function kilobytes(bytes) {
  return `${Math.round(bytes / 1024)} kB`
}

async function main() {
  if (!existsSync(demo)) {
    throw new Error('demo/dist/index.html is missing. Run pnpm run build:demo.')
  }
  const steps = docsSteps()
  if (steps.length === 0) {
    throw new Error('No docs page names a step of the demo.')
  }

  mkdirSync(dirname(DOCS_DEMO), { recursive: true })
  copyFileSync(demo, DOCS_DEMO)
  console.log(
    `${relative(DOCS_APP, DOCS_DEMO)}  ${kilobytes(statSync(DOCS_DEMO).size)}`,
  )

  mkdirSync(DOCS_IMAGES, { recursive: true })
  const written = new Set()
  let total = 0
  for (const { step, pages } of steps) {
    for (const theme of THEMES) {
      const source = join(images, `${step}-${theme}.png`)
      if (!existsSync(source)) {
        throw new Error(
          `${pages.join(', ')} shows the step "${step}", but there is no image of it. Is it in the demo and in scripts/demo-images.mjs?`,
        )
      }
      const name = `${step}-${theme}.webp`
      const target = join(DOCS_IMAGES, name)
      const { width, height, size } = await sharp(source)
        .resize({ width: WIDTH })
        .webp({ quality: QUALITY })
        .toFile(target)
      written.add(name)
      total += size
      console.log(
        `${relative(DOCS_APP, target)}  ${width} × ${height}  ${kilobytes(size)}`,
      )
    }
  }

  for (const name of readdirSync(DOCS_IMAGES)) {
    if (!written.has(name)) {
      rmSync(join(DOCS_IMAGES, name))
      console.log(`removed ${name}, which no page uses`)
    }
  }
  console.log(
    `${written.size} images for ${steps.length} steps, ${kilobytes(total)} in all`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
