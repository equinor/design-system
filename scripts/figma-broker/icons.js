/**
 * Figma Icon Broker
 *
 * Standalone script to extract only icons from Figma.
 * Reuses dependencies from figma-broker package.
 *
 * Usage:
 *   pnpm export:icons           # Use cached Figma file
 *   pnpm export:icons -- true   # Force fetch from Figma
 *
 * Environment:
 *   FIGMA_TOKEN or PERSONAL_ACCESS_TOKEN in .env
 */

import { argv } from 'process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { optimize } from 'svgo'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

// Configuration
const DEFAULT_FILE_ID = 'BQjYMxdSdgRkdhKTDDU7L4KU'
const FIGMA_TOKEN = process.env.FIGMA_TOKEN || process.env.PERSONAL_ACCESS_TOKEN

const ROOT_DIR = path.resolve(__dirname, '../..')
const PATHS = {
  CACHE: path.join(__dirname, 'raw'),
  ASSETS_ICONS: path.join(ROOT_DIR, 'assets/icons'),
  ICONS_SRC: path.join(ROOT_DIR, 'packages/eds-icons/src'),
  STORYBOOK_ICONS: path.join(
    ROOT_DIR,
    'packages/eds-core-react/stories/assets/icons',
  ),
}

// ============================================================================
// Figma API
// ============================================================================

async function fetchFigmaFile(fileId) {
  const url = `https://api.figma.com/v1/files/${fileId}`
  const response = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Figma file: ${response.status}`)
  }
  return response.json()
}

async function fetchFigmaImageUrls(fileId, ids) {
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${ids.join(',')}&format=svg`
  const response = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch image URLs: ${response.status}`)
  }

  const data = await response.json()
  if (data.err) throw new Error(`Figma API error: ${data.err}`)
  return data.images
}

// ============================================================================
// Cache
// ============================================================================

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

async function getCachedOrFetch(fileId, forceRefresh) {
  const cachePath = path.join(PATHS.CACHE, `${fileId}.json`)

  if (!forceRefresh && fs.existsSync(cachePath)) {
    console.info('📂 Using cached Figma file')
    const data = await fs.promises.readFile(cachePath, 'utf-8')
    return JSON.parse(data)
  }

  console.info('📥 Fetching file from Figma API...')
  const data = await fetchFigmaFile(fileId)
  ensureDir(PATHS.CACHE)
  await fs.promises.writeFile(cachePath, JSON.stringify(data, null, 2), 'utf-8')
  return data
}

// ============================================================================
// Parse Icons
// ============================================================================

function toCamelCase(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('')
}

function parseIconsFromFigmaFile(figmaData) {
  const groups = []
  const pages = figmaData.document?.children || []

  for (const page of pages) {
    if (/^🚧/.test(page.name)) continue
    const pageName = page.name.toLowerCase().trim()

    if (pageName === 'system icons' || pageName === 'product icons') {
      const icons = []
      const groupName =
        pageName === 'system icons' ? 'system-icons' : 'product-icons'

      for (const frame of page.children || []) {
        if (frame.type !== 'FRAME') continue

        for (const child of frame.children || []) {
          if (child.type === 'COMPONENT') {
            icons.push({
              name: toCamelCase(child.name),
              id: child.id,
            })
          } else if (child.type === 'COMPONENT_SET') {
            // Only use default (24px) variant
            const defaultVariant = child.children?.find((c) =>
              /default/i.test(c.name),
            )
            if (defaultVariant) {
              icons.push({
                name: toCamelCase(child.name),
                id: defaultVariant.id,
              })
            }
          }
        }
      }

      if (icons.length > 0) {
        groups.push({ name: groupName, icons })
      }
    }
  }

  return groups
}

// ============================================================================
// Fetch & Optimize SVGs
// ============================================================================

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          sortAttrs: false,
        },
      },
    },
    { name: 'removeViewBox', active: false },
    { name: 'removeAttrs', params: { attrs: '(fill)' } },
  ],
}

function extractPathData(svg) {
  const matches = svg.match(/d="([^"]+)"/g) || []
  return matches.map((m) => m.slice(3, -1)).join(' ')
}

async function fetchAndOptimizeSvgs(iconGroups, fileId) {
  console.info('🔗 Fetching SVG URLs from Figma...')

  const allIds = iconGroups.flatMap((g) => g.icons.map((i) => i.id))
  const imageUrls = await fetchFigmaImageUrls(fileId, allIds)

  // Wait for Figma to generate SVGs
  console.info('   Waiting for Figma to generate SVGs...')
  await new Promise((r) => setTimeout(r, 5000))

  const total = allIds.length
  let current = 0

  console.info(`⬇️  Downloading and optimizing ${total} SVGs...`)

  for (const group of iconGroups) {
    for (const icon of group.icons) {
      current++
      const url = imageUrls[icon.id]
      if (!url) {
        console.warn(`   Warning: No URL for ${icon.name}`)
        continue
      }

      try {
        process.stdout.write(
          `\r   Processing ${current}/${total}: ${icon.name.padEnd(30)}`,
        )
        const response = await fetch(url)
        const svgRaw = await response.text()
        const result = optimize(svgRaw, svgoConfig)

        const widthMatch = result.data.match(/width="([^"]+)"/)
        const heightMatch = result.data.match(/height="([^"]+)"/)

        icon.svg = result.data
        icon.width = widthMatch?.[1] || '24'
        icon.height = heightMatch?.[1] || '24'
        icon.pathData = extractPathData(result.data)
      } catch (err) {
        console.warn(
          `\n   Warning: Failed to fetch ${icon.name}: ${err.message}`,
        )
      }
    }
  }

  console.info(`\n   ✓ Processed ${total} icons`)
  return iconGroups
}

// ============================================================================
// Write Outputs
// ============================================================================

function writeSvgFiles(iconGroups) {
  for (const group of iconGroups) {
    const groupDir = path.join(PATHS.ASSETS_ICONS, group.name)
    ensureDir(groupDir)

    for (const icon of group.icons) {
      if (!icon.svg) continue
      const filePath = path.join(groupDir, `${icon.name}.svg`)
      fs.writeFileSync(filePath, icon.svg + '\n', 'utf-8')
    }
    console.info(
      `   Wrote ${group.icons.length} SVGs to assets/icons/${group.name}/`,
    )
  }
}

function writeJsonData(iconGroups) {
  for (const group of iconGroups) {
    const groupDir = path.join(PATHS.STORYBOOK_ICONS, group.name)
    ensureDir(groupDir)

    for (const icon of group.icons) {
      if (!icon.pathData) continue
      const jsonData = {
        name: icon.name,
        width: icon.width,
        height: icon.height,
        svgPathData: icon.pathData,
      }
      const filePath = path.join(groupDir, `${icon.name}.json`)
      fs.writeFileSync(
        filePath,
        JSON.stringify(jsonData, null, 2) + '\n',
        'utf-8',
      )
    }
    console.info(
      `   Wrote ${group.icons.length} JSON files to stories/assets/icons/${group.name}/`,
    )
  }
}

function writeTypeScriptData(iconGroups) {
  ensureDir(PATHS.ICONS_SRC)

  const lines = [`import type { IconData } from './types'`, '']

  for (const group of iconGroups) {
    for (const icon of group.icons) {
      if (!icon.pathData) continue
      lines.push(`export const ${icon.name}: IconData = {
  name: '${icon.name}',
  prefix: 'eds',
  height: '${icon.height}',
  width: '${icon.width}',
  svgPathData: '${icon.pathData}',
}
`)
    }
  }

  const filePath = path.join(PATHS.ICONS_SRC, 'data.ts')
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')

  const total = iconGroups.reduce((sum, g) => sum + g.icons.length, 0)
  console.info(`   Wrote ${total} icons to packages/eds-icons/src/data.ts`)
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const fileId = argv[2] && argv[2] !== 'true' ? argv[2] : DEFAULT_FILE_ID
  const forceRefresh = argv.includes('true') || argv.includes('--force')

  if (!FIGMA_TOKEN) {
    console.error(
      'Error: FIGMA_TOKEN or PERSONAL_ACCESS_TOKEN required in .env',
    )
    process.exit(1)
  }

  console.info('🎨 Figma Icon Broker')
  console.info('====================')

  try {
    const figmaData = await getCachedOrFetch(fileId, forceRefresh)

    console.info('🔍 Parsing icons from Figma file...')
    const iconGroups = parseIconsFromFigmaFile(figmaData)
    const total = iconGroups.reduce((sum, g) => sum + g.icons.length, 0)
    console.info(`   Found ${total} icons in ${iconGroups.length} groups`)

    const iconsWithSvg = await fetchAndOptimizeSvgs(iconGroups, fileId)

    console.info('💾 Writing output files...')
    writeSvgFiles(iconsWithSvg)
    writeJsonData(iconsWithSvg)
    writeTypeScriptData(iconsWithSvg)

    console.info('')
    console.info('✅ Done! Icons exported successfully.')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
