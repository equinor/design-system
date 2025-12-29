/**
 * Figma Icon Broker
 *
 * Standalone script to extract only icons from Figma.
 * Reuses dependencies from figma-broker package.
 *
 * Usage:
 *   pnpm icons                           # Use cached Figma file
 *   pnpm icons --force                   # Force fetch from Figma
 *   pnpm icons --only icon1,icon2,icon3  # Update only specific icons
 *   pnpm icons --force --only jacket,monopile
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

function toSnakeCase(name) {
  // Same logic as propName() in the old broker
  // First replace hyphens with spaces (like old broker does before propName)
  return name
    .replace(/-/g, ' ') // Hyphens to spaces first (old broker does this before propName)
    .replace(/[|]|[.]|[–]|[—]|[+]|[,]/g, '') // Remove forbidden chars
    .replace(/^[0-9]*/, '') // Remove leading numbers
    .toLowerCase()
    .trim()
    .replace(/[\s+]|[:\s+]/g, '_') // Spaces to underscores
    .replace(/[/]/g, '__') // Slashes to double underscores
    .replace('___', '__')
}

function toPathName(name) {
  // Same logic as pathName() in the old broker
  return toSnakeCase(name).replace('__', '-').replace(/_/g, '-')
}

function parseIconsFromFigmaFile(figmaData) {
  const groups = []
  const pages = figmaData.document?.children || []

  for (const page of pages) {
    if (/^🚧/.test(page.name)) continue
    const pageName = page.name.toLowerCase().trim()

    // Only export system icons (matching old broker behavior)
    if (pageName === 'system icons') {
      const icons = []
      const groupName = 'system-icons'

      for (const frame of page.children || []) {
        if (frame.type !== 'FRAME') continue
        const frameGroup = frame.name // e.g., "UI views", "Navigation"

        for (const child of frame.children || []) {
          if (child.type === 'COMPONENT') {
            icons.push({
              name: toSnakeCase(child.name),
              originalName: child.name, // Keep original Figma name for filtering
              id: child.id,
              group: frameGroup,
            })
          } else if (child.type === 'COMPONENT_SET') {
            // Only use default (24px) variant
            const defaultVariant = child.children?.find((c) =>
              /default/i.test(c.name),
            )
            if (defaultVariant) {
              icons.push({
                name: toSnakeCase(child.name),
                originalName: child.name, // Keep original Figma name for filtering
                id: defaultVariant.id,
                group: frameGroup,
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
        icon.url = url // Store the Figma URL
        const response = await fetch(url)
        const svgRaw = await response.text()

        // Use custom plugin to extract dimensions (same as old broker)
        let width = null
        let height = null
        const plugins = [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                sortAttrs: false,
              },
            },
          },
          {
            name: 'removeAttrs',
            params: {
              attrs: '(fill)',
            },
          },
          {
            name: 'find-size',
            fn: () => {
              return {
                element: {
                  enter: (node, parentNode) => {
                    if (parentNode.type === 'root') {
                      width = node.attributes.width
                      height = node.attributes.height
                    }
                  },
                },
              }
            },
          },
        ]

        const result = optimize(svgRaw, { plugins })

        icon.svg = result.data
        icon.width = width || '24'
        icon.height = height || '24'
        icon.viewbox = `0 0 ${height} ${width}`
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
    for (const icon of group.icons) {
      if (!icon.svg) continue
      // Write to subdirectory by icon group (e.g., "navigation", "ui-views")
      const iconPath = icon.group ? toPathName(icon.group) : ''
      const groupDir = path.join(PATHS.ASSETS_ICONS, group.name, iconPath)
      ensureDir(groupDir)

      const filePath = path.join(groupDir, `${icon.name}.svg`)
      fs.writeFileSync(filePath, icon.svg + '\n', 'utf-8')
    }
    console.info(
      `   Wrote ${group.icons.length} SVGs to assets/icons/${group.name}/`,
    )
  }
}

function writeJsonData(iconGroups) {
  ensureDir(PATHS.STORYBOOK_ICONS)

  for (const group of iconGroups) {
    // Output as single JSON array file (same format as old figma-broker)
    const iconsArray = group.icons
      .filter((icon) => icon.pathData)
      .map((icon) => ({
        name: icon.name,
        value: icon.svg,
        id: icon.id,
        url: icon.url || '',
        path: icon.group ? toPathName(icon.group) : '',
        group: icon.group || '',
        viewbox: `0 0 ${icon.width} ${icon.height}`,
        height: icon.height,
        width: icon.width,
        svgPathData: icon.pathData,
      }))

    const filePath = path.join(PATHS.STORYBOOK_ICONS, `${group.name}.json`)
    fs.writeFileSync(
      filePath,
      JSON.stringify(iconsArray, null, 2) + '\n',
      'utf-8',
    )
    console.info(
      `   Wrote ${iconsArray.length} icons to stories/assets/icons/${group.name}.json`,
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
// Merge Functions (for partial updates with --only)
// ============================================================================

function mergeJsonData(iconGroups) {
  for (const group of iconGroups) {
    const filePath = path.join(PATHS.STORYBOOK_ICONS, `${group.name}.json`)
    
    // Read existing JSON
    let existingIcons = []
    if (fs.existsSync(filePath)) {
      existingIcons = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    
    // Create map of updated icons
    const updatedIconsMap = new Map()
    for (const icon of group.icons) {
      if (!icon.pathData) continue
      updatedIconsMap.set(icon.name, {
        name: icon.name,
        value: icon.svg,
        id: icon.id,
        url: icon.url || '',
        path: icon.group ? toPathName(icon.group) : '',
        group: icon.group || '',
        viewbox: `0 0 ${icon.width} ${icon.height}`,
        height: icon.height,
        width: icon.width,
        svgPathData: icon.pathData,
      })
    }
    
    // Merge: replace existing icons with updated ones
    const mergedIcons = existingIcons.map((existing) =>
      updatedIconsMap.has(existing.name) 
        ? updatedIconsMap.get(existing.name) 
        : existing
    )
    
    fs.writeFileSync(
      filePath,
      JSON.stringify(mergedIcons, null, 2) + '\n',
      'utf-8',
    )
    console.info(
      `   Updated ${updatedIconsMap.size} icons in stories/assets/icons/${group.name}.json`,
    )
  }
}

function mergeTypeScriptData(iconGroups) {
  const filePath = path.join(PATHS.ICONS_SRC, 'data.ts')
  
  // Read existing file
  let existingContent = ''
  if (fs.existsSync(filePath)) {
    existingContent = fs.readFileSync(filePath, 'utf-8')
  }
  
  // Build updated icon exports
  const updatedIcons = new Map()
  for (const group of iconGroups) {
    for (const icon of group.icons) {
      if (!icon.pathData) continue
      updatedIcons.set(icon.name, `export const ${icon.name}: IconData = {
  name: '${icon.name}',
  prefix: 'eds',
  height: '${icon.height}',
  width: '${icon.width}',
  svgPathData: '${icon.pathData}',
}`)
    }
  }
  
  // Replace each icon's export block in the file
  let newContent = existingContent
  for (const [name, newExport] of updatedIcons) {
    const regex = new RegExp(
      `export const ${name}: IconData = \\{[^}]+\\}`,
      'g'
    )
    newContent = newContent.replace(regex, newExport)
  }
  
  fs.writeFileSync(filePath, newContent, 'utf-8')
  console.info(
    `   Updated ${updatedIcons.size} icons in packages/eds-icons/src/data.ts`,
  )
}

// ============================================================================
// Main
// ============================================================================

function parseArgs() {
  const args = argv.slice(2)
  const forceRefresh = args.includes('--force')
  
  // Parse --only flag: --only icon1,icon2,icon3
  const onlyIndex = args.indexOf('--only')
  let onlyIcons = null
  if (onlyIndex !== -1 && args[onlyIndex + 1]) {
    onlyIcons = args[onlyIndex + 1].split(',').map((name) => name.trim().toLowerCase())
  }
  
  // Find file ID (any arg that isn't a flag or flag value)
  const fileId = args.find((arg, i) => 
    !arg.startsWith('--') && 
    args[i - 1] !== '--only'
  ) || DEFAULT_FILE_ID
  
  return { forceRefresh, onlyIcons, fileId }
}

async function main() {
  const { forceRefresh, onlyIcons, fileId } = parseArgs()

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
    let iconGroups = parseIconsFromFigmaFile(figmaData)
    
    // Filter to only specific icons if --only flag is provided
    if (onlyIcons && onlyIcons.length > 0) {
      console.info(`   Filtering to: ${onlyIcons.join(', ')}`)
      iconGroups = iconGroups.map((group) => ({
        ...group,
        icons: group.icons.filter((icon) => 
          onlyIcons.some((name) => 
            // Match against original Figma name (with spaces) or converted name (snake_case)
            icon.originalName.toLowerCase().includes(name) ||
            icon.name.toLowerCase().includes(name)
          )
        ),
      })).filter((group) => group.icons.length > 0)
    }
    
    const total = iconGroups.reduce((sum, g) => sum + g.icons.length, 0)
    
    if (total === 0) {
      console.error('❌ No icons found matching the filter')
      process.exit(1)
    }
    
    console.info(`   Found ${total} icons in ${iconGroups.length} groups`)

    const iconsWithSvg = await fetchAndOptimizeSvgs(iconGroups, fileId)

    console.info('💾 Writing output files...')
    writeSvgFiles(iconsWithSvg)
    
    // For partial updates, merge with existing JSON/TS data
    if (onlyIcons && onlyIcons.length > 0) {
      mergeJsonData(iconsWithSvg)
      mergeTypeScriptData(iconsWithSvg)
    } else {
      writeJsonData(iconsWithSvg)
      writeTypeScriptData(iconsWithSvg)
    }

    console.info('')
    console.info('✅ Done! Icons exported successfully.')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
