/**
 * Figma Icon Broker
 *
 * A standalone script that extracts SVG icons from a Figma design file and outputs them
 * in multiple formats for use in the Equinor Design System (EDS).
 *
 * ## Overview
 *
 * This script performs the following workflow:
 * 1. Fetches the Figma file structure via the Figma API (or uses cached data)
 * 2. Parses the file to find all icon components on the "system icons" page
 * 3. Requests SVG renders for each icon from Figma's image API
 * 4. Optimizes SVGs using SVGO (removes fills, preserves viewBox, etc.)
 * 5. Outputs icons in three formats:
 *    - Individual SVG files in assets/icons/system-icons/{group}/
 *    - JSON metadata file for Storybook
 *    - TypeScript exports for the @equinor/eds-icons package
 *
 * ## Usage
 *
 *   pnpm icons                                           # Use cached Figma file (fast)
 *   pnpm icons --force                                   # Force fresh fetch from Figma API
 *   pnpm icons --only icon1,icon2,icon3                  # Update only specific icons (partial update)
 *   pnpm icons --force --only jacket,monopile            # Combine flags and force update only specific icons (partial update)
 *   pnpm icons --debug                                   # Enable verbose debug logging
 *   pnpm icons --dry-run                                 # Preview changes without writing files
 *   pnpm icons --dry-run --debug --only jacket,monopile  # Combine flags for dry-run partial update with debug
 *
 *   Remember: No spaces in "--only"-flag after "," separator! I.e "--only icon1,icon2,icon3,icon4"
 *
 * ## Icon Name Filtering (--only)
 *
 * The --only flag accepts comma-separated icon names. Names are matched using partial,
 * case-insensitive matching against both:
 *   - Original Figma name (with spaces): "substation onshore", "arrow up"
 *   - Converted snake_case name: "substation_onshore", "arrow_up"
 *
 * Examples:
 *   --only jacket                    # Matches "jacket"
 *   --only "substation onshore"      # Matches using Figma name (quote for spaces)
 *   --only substation_onshore        # Matches using snake_case name
 *   --only substation                # Partial match - finds all icons containing "substation"
 *   --only jacket,monopile,turbine   # Multiple icons
 *
 * ## Environment Variables
 *
 *   FIGMA_TOKEN or PERSONAL_ACCESS_TOKEN - Required Figma API access token
 *   (Set in .env file in this directory)
 *
 * ## Output Locations
 *
 *   - SVG files:     {repo}/assets/icons/system-icons/{group}/{icon_name}.svg
 *   - JSON metadata: {repo}/packages/eds-core-react/stories/assets/icons/system-icons.json
 *   - TypeScript:    {repo}/packages/eds-icons/src/data.ts
 *
 * @module icons
 * @author EDS Core Team
 */

import { argv } from 'process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { optimize } from 'svgo'

// Get the directory path of this script (ES modules don't have __dirname)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env file in the script's directory
dotenv.config({ path: path.join(__dirname, '.env') })

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Default Figma file ID for the EDS Icons file.
 * This can be found in the Figma URL: figma.com/file/{FILE_ID}/...
 */
const DEFAULT_FILE_ID = 'BQjYMxdSdgRkdhKTDDU7L4KU'

/**
 * Figma API access token - loaded from environment variables.
 * Supports both FIGMA_TOKEN and PERSONAL_ACCESS_TOKEN for flexibility.
 * Generate at: https://www.figma.com/developers/api#access-tokens
 */
const FIGMA_TOKEN = process.env.FIGMA_TOKEN || process.env.PERSONAL_ACCESS_TOKEN

/**
 * Root directory of the monorepo (two levels up from scripts/figma-broker/)
 */
const ROOT_DIR = path.resolve(__dirname, '../..')

/**
 * Output paths for generated files.
 * All paths are absolute to avoid issues with working directory.
 */
const PATHS = {
  /** Directory for caching Figma API responses */
  CACHE: path.join(__dirname, 'raw'),
  /** Directory for individual SVG files, organized by icon group */
  ASSETS_ICONS: path.join(ROOT_DIR, 'assets/icons'),
  /** Source directory for @equinor/eds-icons package */
  ICONS_SRC: path.join(ROOT_DIR, 'packages/eds-icons/src'),
  /** Directory for Storybook icon assets (JSON format) */
  STORYBOOK_ICONS: path.join(
    ROOT_DIR,
    'packages/eds-core-react/stories/assets/icons',
  ),
}

// =============================================================================
// DEBUG & LOGGING UTILITIES
// =============================================================================

/**
 * Global flag to enable/disable debug output.
 * Set via --debug command line flag.
 */
let DEBUG = false

/**
 * Global flag to enable dry-run mode (no file writes).
 * Set via --dry-run command line flag.
 */
let DRY_RUN = false

/**
 * Logs a debug message if DEBUG mode is enabled.
 * @param {string} msg - The message to log
 */
const debug = (msg) => DEBUG && console.info(`[DEBUG] ${msg}`)

/**
 * Logs a dry-run message if DRY_RUN mode is enabled.
 * @param {string} msg - The message to log
 */
const dryRun = (msg) => DRY_RUN && console.info(`[DRY-RUN] ${msg}`)

/**
 * Simple timing utility to measure operation durations.
 * Stores start times keyed by operation name.
 */
const timing = {}

/**
 * Starts a timer for a named operation.
 * @param {string} name - Name of the operation to time
 */
const startTimer = (name) => {
  timing[name] = Date.now()
}

/**
 * Ends a timer and logs the duration in debug mode.
 * @param {string} name - Name of the operation that was timed
 * @returns {string} Duration in seconds (e.g., "2.34")
 */
const endTimer = (name) => {
  const duration = ((Date.now() - timing[name]) / 1000).toFixed(2)
  debug(`${name}: ${duration}s`)
  return duration
}
// =============================================================================
// FIGMA API FUNCTIONS
// =============================================================================

/**
 * Fetches the complete Figma file structure from the Figma API.
 *
 * This returns the entire document tree including all pages, frames, and components.
 * The response is large (several MB) but contains all the metadata needed to identify icons.
 *
 * Note: This does NOT return the actual SVG content - just the structure.
 * SVG content must be fetched separately via fetchFigmaImageUrls().
 *
 * @param {string} fileId - The Figma file ID (from the URL)
 * @returns {Promise<Object>} The Figma file data including document structure
 * @throws {Error} If the API request fails (e.g., 401 unauthorized, 404 not found)
 *
 * @see https://www.figma.com/developers/api#get-files-endpoint
 */
async function fetchFigmaFile(fileId) {
  const url = `https://api.figma.com/v1/files/${fileId}`
  debug(`API: GET ${url}`)
  startTimer('fetchFigmaFile')

  const response = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  })

  debug(`API: Response ${response.status} ${response.statusText}`)
  endTimer('fetchFigmaFile')

  if (!response.ok) {
    throw new Error(`Failed to fetch Figma file: ${response.status}`)
  }
  return response.json()
}

/**
 * Fetches SVG render URLs for a list of Figma node IDs.
 *
 * Figma generates SVG renders on-demand and returns temporary S3 URLs.
 * These URLs are valid for approximately 14 days.
 *
 * The returned object maps node IDs to their SVG URLs:
 * { "123:456": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/...", ... }
 *
 * @param {string} fileId - The Figma file ID
 * @param {string[]} ids - Array of Figma node IDs (e.g., ["123:456", "789:012"])
 * @returns {Promise<Object>} Map of node ID to SVG URL
 * @throws {Error} If the API request fails or returns an error
 *
 * @see https://www.figma.com/developers/api#get-images-endpoint
 */
async function fetchFigmaImageUrls(fileId, ids) {
  // Join all IDs into a comma-separated string for the API request
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${ids.join(',')}&format=svg`
  debug(`API: GET /v1/images/... (${ids.length} icons)`)
  startTimer('fetchFigmaImageUrls')

  const response = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  })

  debug(`API: Response ${response.status} ${response.statusText}`)
  endTimer('fetchFigmaImageUrls')

  if (!response.ok) {
    throw new Error(`Failed to fetch image URLs: ${response.status}`)
  }

  const data = await response.json()

  // Figma API returns errors in the response body, not as HTTP errors
  if (data.err) throw new Error(`Figma API error: ${data.err}`)

  return data.images
}

// =============================================================================
// CACHE & FILE UTILITIES
// =============================================================================

/**
 * Creates a directory and all parent directories if they don't exist.
 * Equivalent to `mkdir -p` in shell.
 *
 * @param {string} dirPath - Absolute path to the directory to create
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Gets Figma file data from cache or fetches fresh data from the API.
 *
 * Caching is important because:
 * 1. The Figma file is large (several MB) and slow to fetch
 * 2. It reduces API calls during development/testing
 * 3. It allows offline development with cached data
 *
 * Cache files are stored in scripts/figma-broker/raw/{fileId}.json
 *
 * @param {string} fileId - The Figma file ID
 * @param {boolean} forceRefresh - If true, ignores cache and fetches fresh data
 * @returns {Promise<Object>} The Figma file data
 */
async function getCachedOrFetch(fileId, forceRefresh) {
  const cachePath = path.join(PATHS.CACHE, `${fileId}.json`)
  debug(`Cache path: ${cachePath}`)

  // Check if we can use cached data
  if (!forceRefresh && fs.existsSync(cachePath)) {
    // Calculate and log cache age for debugging
    const stats = fs.statSync(cachePath)
    const ageMinutes = Math.round((Date.now() - stats.mtimeMs) / 60000)
    debug(`Cache: HIT (age: ${ageMinutes} minutes)`)

    console.info('📂 Using cached Figma file')
    const data = await fs.promises.readFile(cachePath, 'utf-8')
    return JSON.parse(data)
  }

  // Cache miss or forced refresh - fetch from API
  debug(`Cache: MISS ${forceRefresh ? '(forced)' : '(not found)'}`)
  console.info('📥 Fetching file from Figma API...')

  const data = await fetchFigmaFile(fileId)

  // Save to cache for future runs
  ensureDir(PATHS.CACHE)
  await fs.promises.writeFile(cachePath, JSON.stringify(data, null, 2), 'utf-8')
  debug(`Cache: Written ${(JSON.stringify(data).length / 1024).toFixed(0)}KB`)

  return data
}

// =============================================================================
// NAME CONVERSION UTILITIES
// =============================================================================

/**
 * Converts a Figma component name to snake_case for use as a variable/file name.
 *
 * This matches the behavior of the old figma-broker's propName() function.
 * The conversion ensures names are valid JavaScript identifiers and consistent
 * across all output formats.
 *
 * Transformation steps:
 * 1. Replace hyphens with spaces (before other processing)
 * 2. Remove forbidden characters: | . – — + ,
 * 3. Remove leading numbers (JS identifiers can't start with numbers)
 * 4. Convert to lowercase
 * 5. Trim whitespace
 * 6. Replace spaces/colons with underscores
 * 7. Replace slashes with double underscores
 *
 * Examples:
 *   "Arrow-Up"       -> "arrow_up"
 *   "3D Rotate"      -> "d_rotate" (leading number removed)
 *   "Add + Remove"   -> "add_remove"
 *   "UI/Settings"    -> "ui__settings"
 *
 * @param {string} name - The original Figma component name
 * @returns {string} The converted snake_case name
 */
function toSnakeCase(name) {
  return name
    .replace(/-/g, ' ') // Step 1: Hyphens to spaces
    .replace(/[|]|[.]|[–]|[—]|[+]|[,]/g, '') // Step 2: Remove forbidden chars
    .replace(/^[0-9]*/, '') // Step 3: Remove leading numbers
    .toLowerCase() // Step 4: Lowercase
    .trim() // Step 5: Trim whitespace
    .replace(/[\s+]|[:\s+]/g, '_') // Step 6: Spaces/colons to underscores
    .replace(/[/]/g, '__') // Step 7: Slashes to double underscores
    .replace('___', '__') // Cleanup: Prevent triple underscores
}

/**
 * Converts a name to kebab-case for use in directory/file paths.
 *
 * This matches the behavior of the old figma-broker's pathName() function.
 * Used for creating the subdirectory structure in assets/icons/.
 *
 * Examples:
 *   "UI Views"       -> "ui-views"
 *   "Communication + Feedback" -> "communication-feedback"
 *
 * @param {string} name - The original name (e.g., Figma frame name)
 * @returns {string} The converted kebab-case path name
 */
function toPathName(name) {
  return toSnakeCase(name)
    .replace('__', '-') // Double underscores to single hyphen
    .replace(/_/g, '-') // All underscores to hyphens
}

// =============================================================================
// FIGMA FILE PARSING
// =============================================================================

/**
 * Parses the Figma file structure to extract icon component information.
 *
 * ## Figma File Structure
 *
 * The EDS Icons Figma file is organized as:
 * - Document
 *   - Page: "System Icons"
 *     - Frame: "Navigation" (icon group/category)
 *       - COMPONENT: "home" (simple icon)
 *       - COMPONENT_SET: "arrow up" (icon with variants like size=default, size=small)
 *         - COMPONENT: "size=default" (24px variant - we use this one)
 *         - COMPONENT: "size=small" (16px variant - ignored)
 *     - Frame: "Energy" (another group)
 *       - ...
 *   - Page: "Product Icons" (ignored - old broker only exports system icons)
 *   - Page: "🚧 WIP" (ignored - work in progress)
 *
 * ## Component Types
 *
 * - COMPONENT: A single icon with no variants
 * - COMPONENT_SET: An icon with multiple variants (sizes, states, etc.)
 *   - For component sets, we only export the "default" variant (24px)
 *
 * @param {Object} figmaData - The raw Figma API response
 * @returns {Array<{name: string, icons: Array}>} Array of icon groups with their icons
 *
 * @example
 * // Returned structure:
 * [
 *   {
 *     name: 'system-icons',
 *     icons: [
 *       { name: 'home', originalName: 'home', id: '123:456', group: 'Navigation' },
 *       { name: 'arrow_up', originalName: 'arrow up', id: '789:012', group: 'Navigation' },
 *       ...
 *     ]
 *   }
 * ]
 */
function parseIconsFromFigmaFile(figmaData) {
  const groups = []
  const pages = figmaData.document?.children || []

  debug(`Parsing: Found ${pages.length} pages`)

  for (const page of pages) {
    // Skip pages marked as work-in-progress (prefixed with 🚧)
    if (/^🚧/.test(page.name)) {
      debug(`Parsing: Skipping page "${page.name}" (WIP)`)
      continue
    }
    const pageName = page.name.toLowerCase().trim()

    // Only export system icons
    // Product icons and other pages are ignored
    if (pageName === 'system icons') {
      const icons = []
      const groupName = 'system-icons'
      let componentCount = 0
      let componentSetCount = 0

      // Iterate through frames (icon categories like "Navigation", "Energy")
      for (const frame of page.children || []) {
        if (frame.type !== 'FRAME') continue
        const frameGroup = frame.name // e.g., "UI views", "Navigation"

        // Iterate through components within each frame
        for (const child of frame.children || []) {
          if (child.type === 'COMPONENT') {
            // Simple component - single icon with no variants
            componentCount++
            icons.push({
              name: toSnakeCase(child.name), // Converted name for code
              originalName: child.name, // Original Figma name for filtering
              id: child.id, // Figma node ID for API requests
              group: frameGroup, // Category name for organization
            })
          } else if (child.type === 'COMPONENT_SET') {
            // Component set - icon with variants (we only want the default/24px)
            componentSetCount++

            // Find the default variant (usually "size=default" or just "default")
            const defaultVariant = child.children?.find((c) =>
              /default/i.test(c.name),
            )

            if (defaultVariant) {
              icons.push({
                name: toSnakeCase(child.name), // Use the set name, not variant name
                originalName: child.name,
                id: defaultVariant.id, // Use the default variant's ID
                group: frameGroup,
              })
            }
          }
        }
      }

      debug(
        `Parsing: Page "${page.name}" has ${componentCount} components, ${componentSetCount} component sets`,
      )

      if (icons.length > 0) {
        groups.push({ name: groupName, icons })
      }
    }
  }

  return groups
}

// =============================================================================
// SVG FETCHING & OPTIMIZATION
// =============================================================================

/**
 * Extracts the SVG path data (the `d` attribute) from an SVG string.
 *
 * This is used for the `svgPathData` field in the icon exports, which allows
 * rendering icons without parsing the full SVG. Multiple paths are joined
 * with a space.
 *
 * @param {string} svg - The SVG markup string
 * @returns {string} The extracted path data (d attribute values)
 *
 * @example
 * extractPathData('<svg><path d="M0 0L10 10"/><path d="M5 5L15 15"/></svg>')
 * // Returns: "M0 0L10 10 M5 5L15 15"
 */
function extractPathData(svg) {
  // Find all d="..." attributes in the SVG
  const matches = svg.match(/d="([^"]+)"/g) || []
  // Extract just the path data (remove 'd="' prefix and '"' suffix)
  return matches.map((m) => m.slice(3, -1)).join(' ')
}

/**
 * Fetches SVG content for all icons and optimizes them using SVGO.
 *
 * ## Process
 *
 * 1. Request SVG URLs from Figma for all icon node IDs
 * 2. Wait 5 seconds for Figma to generate the SVGs (they're rendered on-demand)
 * 3. Download each SVG from the temporary S3 URL
 * 4. Optimize each SVG using SVGO:
 *    - Apply default optimizations
 *    - Preserve viewBox (important for proper scaling)
 *    - Remove fill attributes (icons should inherit color from CSS)
 *    - Extract width/height dimensions
 * 5. Extract path data for use in icon components
 *
 * After this function, each icon object will have additional properties:
 * - svg: The optimized SVG markup
 * - width: The icon width (e.g., "24")
 * - height: The icon height (e.g., "24")
 * - viewbox: The viewBox attribute value
 * - pathData: The extracted SVG path data
 * - url: The Figma S3 URL (for reference)
 *
 * @param {Array} iconGroups - Array of icon groups from parseIconsFromFigmaFile()
 * @param {string} fileId - The Figma file ID
 * @returns {Promise<Array>} The icon groups with SVG data added to each icon
 */
async function fetchAndOptimizeSvgs(iconGroups, fileId) {
  console.info('🔗 Fetching SVG URLs from Figma...')

  // Collect all node IDs to request in a single API call
  const allIds = iconGroups.flatMap((g) => g.icons.map((i) => i.id))
  const imageUrls = await fetchFigmaImageUrls(fileId, allIds)

  // Figma generates SVGs on-demand - wait for them to be ready
  // Without this delay, some URLs may return 404 or incomplete SVGs
  console.info('   Waiting for Figma to generate SVGs...')
  await new Promise((r) => setTimeout(r, 5000))

  const total = allIds.length
  let current = 0

  console.info(`⬇️  Downloading and optimizing ${total} SVGs...`)

  // Process each icon sequentially (parallel would be faster but could hit rate limits)
  for (const group of iconGroups) {
    for (const icon of group.icons) {
      current++
      const url = imageUrls[icon.id]

      // Skip icons that didn't get a URL (shouldn't happen normally)
      if (!url) {
        console.warn(`   Warning: No URL for ${icon.name}`)
        continue
      }

      try {
        // Show progress counter (overwrites the same line)
        process.stdout.write(
          `\r   Processing ${current}/${total}: ${icon.name.padEnd(30)}`,
        )

        // Store the URL for reference (included in JSON output)
        icon.url = url

        // Download the raw SVG from Figma's S3 bucket
        const response = await fetch(url)
        const svgRaw = await response.text()

        // Variables to capture dimensions during SVGO processing
        let width = null
        let height = null

        // SVGO plugin configuration for SVGO v4
        // Note: In SVGO v4, removeViewBox is NOT part of preset-default
        // (viewBox is preserved by default), so no override needed
        const plugins = [
          {
            // Apply default optimizations (minify, remove comments, etc.)
            name: 'preset-default',
            params: {
              overrides: {
                // Disable attribute sorting to preserve original order
                // This prevents unnecessary diffs in version control
                sortAttrs: false,
              },
            },
          },
          {
            // Remove fill attributes so icons inherit color from CSS
            name: 'removeAttrs',
            params: {
              attrs: '(fill)',
            },
          },
          {
            // Custom plugin to extract width/height from the root SVG element
            name: 'find-size',
            fn: () => {
              return {
                element: {
                  enter: (node, parentNode) => {
                    // Only look at the root <svg> element
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

        // Run SVGO optimization
        const result = optimize(svgRaw, { plugins })

        // Store results on the icon object
        icon.svg = result.data
        icon.width = width || '24' // Default to 24 if not found
        icon.height = height || '24'
        icon.viewbox = `0 0 ${width} ${height}`
        icon.pathData = extractPathData(result.data)
      } catch (err) {
        // Log warning but continue processing other icons
        console.warn(
          `\n   Warning: Failed to fetch ${icon.name}: ${err.message}`,
        )
      }
    }
  }

  console.info(`\n   ✓ Processed ${total} icons`)
  return iconGroups
}

// =============================================================================
// OUTPUT WRITERS - FULL EXPORT
// =============================================================================
// These functions write complete output files, replacing any existing content.
// Used when running without --only flag (full icon export).

/**
 * Writes individual SVG files to the assets/icons directory.
 *
 * Output structure:
 *   assets/icons/system-icons/{group}/{icon_name}.svg
 *
 * Example:
 *   assets/icons/system-icons/navigation/home.svg
 *   assets/icons/system-icons/energy/jacket.svg
 *
 * @param {Array} iconGroups - Array of icon groups with SVG data
 */
function writeSvgFiles(iconGroups) {
  for (const group of iconGroups) {
    for (const icon of group.icons) {
      // Skip icons that failed to fetch
      if (!icon.svg) continue

      // Build the output path: assets/icons/{group-name}/{category}/{icon}.svg
      const iconPath = icon.group ? toPathName(icon.group) : ''
      const groupDir = path.join(PATHS.ASSETS_ICONS, group.name, iconPath)
      const filePath = path.join(groupDir, `${icon.name}.svg`)

      // In dry-run mode, just log what would happen
      if (DRY_RUN) {
        dryRun(`Would write: ${filePath}`)
        continue
      }

      // Create directory if it doesn't exist, then write the file
      ensureDir(groupDir)
      debug(`Write: ${filePath}`)
      fs.writeFileSync(filePath, icon.svg + '\n', 'utf-8')
    }

    const action = DRY_RUN ? 'Would write' : 'Wrote'
    console.info(
      `   ${action} ${group.icons.length} SVGs to assets/icons/${group.name}/`,
    )
  }
}

/**
 * Writes icon metadata as a JSON file for Storybook.
 *
 * Output: packages/eds-core-react/stories/assets/icons/system-icons.json
 *
 * This file is used by Storybook to display icon previews and documentation.
 * It contains all icon metadata including the full SVG content and path data.
 *
 * JSON Structure:
 * [
 *   {
 *     "name": "home",
 *     "value": "<svg>...</svg>",
 *     "id": "123:456",
 *     "url": "https://figma-alpha-api.s3...",
 *     "path": "navigation",
 *     "group": "Navigation",
 *     "viewbox": "0 0 24 24",
 *     "height": "24",
 *     "width": "24",
 *     "svgPathData": "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
 *   },
 *   ...
 * ]
 *
 * @param {Array} iconGroups - Array of icon groups with SVG data
 */
function writeJsonData(iconGroups) {
  if (!DRY_RUN) ensureDir(PATHS.STORYBOOK_ICONS)

  for (const group of iconGroups) {
    // Build the JSON array, filtering out icons without path data
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
    const action = DRY_RUN ? 'Would write' : 'Wrote'

    if (DRY_RUN) {
      dryRun(`Would write: ${filePath}`)
    } else {
      fs.writeFileSync(
        filePath,
        JSON.stringify(iconsArray, null, 2) + '\n',
        'utf-8',
      )
    }
    console.info(
      `   ${action} ${iconsArray.length} icons to stories/assets/icons/${group.name}.json`,
    )
  }
}

/**
 * Writes TypeScript icon exports for the @equinor/eds-icons package.
 *
 * Output: packages/eds-icons/src/data.ts
 *
 * This file exports each icon as a named constant that can be imported
 * and used with the EDS Icon component.
 *
 * Generated code structure:
 * ```typescript
 * import type { IconData } from './types'
 *
 * export const home: IconData = {
 *   name: 'home',
 *   prefix: 'eds',
 *   height: '24',
 *   width: '24',
 *   svgPathData: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
 * }
 *
 * export const arrow_up: IconData = { ... }
 * ```
 *
 * Usage in consumer apps:
 * ```tsx
 * import { home, arrow_up } from '@equinor/eds-icons'
 * <Icon data={home} />
 * ```
 *
 * @param {Array} iconGroups - Array of icon groups with SVG data
 */
function writeTypeScriptData(iconGroups) {
  if (!DRY_RUN) ensureDir(PATHS.ICONS_SRC)

  // Start with the type import
  const lines = [`import type { IconData } from './types'`, '']

  // Generate an export for each icon
  for (const group of iconGroups) {
    for (const icon of group.icons) {
      // Skip icons without path data
      if (!icon.pathData) continue

      // Generate the export constant
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
  const total = iconGroups.reduce((sum, g) => sum + g.icons.length, 0)
  const action = DRY_RUN ? 'Would write' : 'Wrote'

  if (DRY_RUN) {
    dryRun(`Would write: ${filePath}`)
  } else {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
  }

  console.info(`   ${action} ${total} icons to packages/eds-icons/src/data.ts`)
}

// =============================================================================
// OUTPUT WRITERS - PARTIAL UPDATE (MERGE)
// =============================================================================
// These functions update only specific icons in existing files.
// Used when running with --only flag (partial icon update).
// They preserve all other icons in the file and only replace the specified ones.

/**
 * Merges updated icon data into the existing JSON file.
 *
 * Unlike writeJsonData(), this function:
 * 1. Reads the existing JSON file
 * 2. Creates a map of updated icons
 * 3. Replaces only the matching icons, keeping others unchanged
 *
 * This is useful when you've updated a few icons in Figma and don't want
 * to re-export the entire icon set.
 *
 * @param {Array} iconGroups - Array of icon groups with updated SVG data
 */
function mergeJsonData(iconGroups) {
  for (const group of iconGroups) {
    const filePath = path.join(PATHS.STORYBOOK_ICONS, `${group.name}.json`)

    // Step 1: Read existing JSON (if it exists)
    let existingIcons = []
    if (fs.existsSync(filePath)) {
      existingIcons = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }

    // Step 2: Create a map of the updated icons (for fast lookup)
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

    // Step 3: Merge - replace existing icons with updated ones, keep others
    const mergedIcons = existingIcons.map(
      (existing) =>
        updatedIconsMap.has(existing.name)
          ? updatedIconsMap.get(existing.name) // Use updated version
          : existing, // Keep original
    )

    const action = DRY_RUN ? 'Would update' : 'Updated'

    if (DRY_RUN) {
      dryRun(`Would update: ${filePath}`)
    } else {
      fs.writeFileSync(
        filePath,
        JSON.stringify(mergedIcons, null, 2) + '\n',
        'utf-8',
      )
    }
    console.info(
      `   ${action} ${updatedIconsMap.size} icons in stories/assets/icons/${group.name}.json`,
    )
  }
}

/**
 * Merges updated icon exports into the existing TypeScript file.
 *
 * Unlike writeTypeScriptData(), this function:
 * 1. Reads the existing data.ts file
 * 2. Uses regex to find and replace only the updated icon exports
 * 3. Preserves all other exports unchanged
 *
 * The regex matches the entire export block:
 *   export const icon_name: IconData = { ... }
 *
 * @param {Array} iconGroups - Array of icon groups with updated SVG data
 */
function mergeTypeScriptData(iconGroups) {
  const filePath = path.join(PATHS.ICONS_SRC, 'data.ts')

  // Step 1: Read existing file content
  let existingContent = ''
  if (fs.existsSync(filePath)) {
    existingContent = fs.readFileSync(filePath, 'utf-8')
  }

  // Step 2: Build new export blocks for updated icons
  const updatedIcons = new Map()
  for (const group of iconGroups) {
    for (const icon of group.icons) {
      if (!icon.pathData) continue
      updatedIcons.set(
        icon.name,
        `export const ${icon.name}: IconData = {
  name: '${icon.name}',
  prefix: 'eds',
  height: '${icon.height}',
  width: '${icon.width}',
  svgPathData: '${icon.pathData}',
}`,
      )
    }
  }

  // Step 3: Replace each icon's export block using regex
  let newContent = existingContent
  for (const [name, newExport] of updatedIcons) {
    // Match the entire export const block for this icon
    // Pattern: export const icon_name: IconData = { ... }
    const regex = new RegExp(
      `export const ${name}: IconData = \\{[^}]+\\}`,
      'g',
    )
    newContent = newContent.replace(regex, newExport)
  }

  const action = DRY_RUN ? 'Would update' : 'Updated'

  if (DRY_RUN) {
    dryRun(`Would update: ${filePath}`)
  } else {
    fs.writeFileSync(filePath, newContent, 'utf-8')
  }
  console.info(
    `   ${action} ${updatedIcons.size} icons in packages/eds-icons/src/data.ts`,
  )
}

// =============================================================================
// COMMAND LINE INTERFACE
// =============================================================================

/**
 * Parses command line arguments.
 *
 * Supported flags:
 * - --force     Force refresh from Figma API (ignore cache)
 * - --debug     Enable verbose debug logging
 * - --dry-run   Preview changes without writing files
 * - --only      Comma-separated list of icon names to update
 *
 * Any non-flag argument is treated as a custom Figma file ID.
 *
 * @returns {Object} Parsed arguments
 * @returns {boolean} .forceRefresh - Whether to ignore cache
 * @returns {boolean} .debugMode - Whether debug logging is enabled
 * @returns {boolean} .dryRunMode - Whether to skip file writes
 * @returns {string[]|null} .onlyIcons - List of icon names to filter, or null for all
 * @returns {string} .fileId - Figma file ID to use
 */
function parseArgs() {
  const args = argv.slice(2) // Remove 'node' and script path

  // Check for boolean flags
  const forceRefresh = args.includes('--force')
  const debugMode = args.includes('--debug')
  const dryRunMode = args.includes('--dry-run')

  // Parse --only flag: --only icon1,icon2,icon3
  const onlyIndex = args.indexOf('--only')
  let onlyIcons = null
  if (onlyIndex !== -1 && args[onlyIndex + 1]) {
    // Split by comma and normalize to lowercase
    onlyIcons = args[onlyIndex + 1]
      .split(',')
      .map((name) => name.trim().toLowerCase())
  }

  // Find file ID (any arg that isn't a flag or flag value)
  const fileId =
    args.find((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--only') ||
    DEFAULT_FILE_ID

  return { forceRefresh, onlyIcons, fileId, debugMode, dryRunMode }
}

// =============================================================================
// MAIN ENTRY POINT
// =============================================================================

/**
 * Main execution function - orchestrates the entire icon export process.
 *
 * ## Execution Flow
 *
 * 1. Parse command line arguments
 * 2. Validate environment (check for Figma token)
 * 3. Fetch or load cached Figma file
 * 4. Parse file structure to find icons
 * 5. Apply --only filter if specified
 * 6. Fetch and optimize SVGs for all icons
 * 7. Write output files (or merge for partial updates)
 *
 * ## Error Handling
 *
 * - Missing token: Exit with error message
 * - No matching icons: Exit with error message
 * - API/fetch errors: Log warning, continue with other icons
 * - In debug mode: Full stack traces are printed
 */
async function main() {
  // Step 1: Parse command line arguments
  const { forceRefresh, onlyIcons, fileId, debugMode, dryRunMode } = parseArgs()

  // Enable global debug and dry-run modes
  DEBUG = debugMode
  DRY_RUN = dryRunMode
  startTimer('total')

  // Debug: Log configuration
  debug(
    `Token: ${FIGMA_TOKEN ? `✓ loaded (${FIGMA_TOKEN.length} chars, starts with "${FIGMA_TOKEN.slice(0, 10)}...")` : '✗ missing'}`,
  )
  debug(`File ID: ${fileId}`)
  debug(`Force refresh: ${forceRefresh}`)
  debug(`Only icons: ${onlyIcons ? onlyIcons.join(', ') : 'all'}`)
  debug(`Dry run: ${dryRunMode}`)

  // Announce dry-run mode to user
  if (DRY_RUN) {
    console.info('🔍 DRY RUN - No files will be written')
  }

  // Step 2: Validate environment
  if (!FIGMA_TOKEN) {
    console.error(
      'Error: FIGMA_TOKEN or PERSONAL_ACCESS_TOKEN required in .env',
    )
    process.exit(1)
  }

  console.info('🎨 Figma Icon Broker')
  console.info('====================')

  try {
    // Step 3: Get Figma file (from cache or API)
    const figmaData = await getCachedOrFetch(fileId, forceRefresh)

    // Step 4: Parse the file to find all icons
    console.info('🔍 Parsing icons from Figma file...')
    let iconGroups = parseIconsFromFigmaFile(figmaData)

    // Step 5: Apply --only filter if specified
    if (onlyIcons && onlyIcons.length > 0) {
      console.info(`   Filtering to: ${onlyIcons.join(', ')}`)
      const beforeCount = iconGroups.reduce((sum, g) => sum + g.icons.length, 0)

      // Filter icons that match any of the specified names
      iconGroups = iconGroups
        .map((group) => ({
          ...group,
          icons: group.icons.filter((icon) =>
            onlyIcons.some(
              (name) =>
                // Match against original Figma name (with spaces) or converted name (snake_case)
                // This allows: --only "substation onshore" OR --only substation_onshore
                icon.originalName.toLowerCase().includes(name) ||
                icon.name.toLowerCase().includes(name),
            ),
          ),
        }))
        .filter((group) => group.icons.length > 0) // Remove empty groups

      // Debug: Show which icons matched
      const matchedNames = iconGroups.flatMap((g) =>
        g.icons.map((i) => `${i.name} (${i.group})`),
      )
      debug(`Filter: Matched ${matchedNames.length}/${beforeCount} icons`)
      matchedNames.forEach((n) => debug(`  - ${n}`))
    }

    const total = iconGroups.reduce((sum, g) => sum + g.icons.length, 0)

    // Exit if no icons matched the filter
    if (total === 0) {
      console.error('❌ No icons found matching the filter')
      process.exit(1)
    }

    console.info(`   Found ${total} icons in ${iconGroups.length} groups`)

    // Step 6: Fetch and optimize all SVGs
    const iconsWithSvg = await fetchAndOptimizeSvgs(iconGroups, fileId)

    // Step 7: Write output files
    console.info('💾 Writing output files...')
    startTimer('writeFiles')

    // SVG files are always written (or overwritten) directly
    writeSvgFiles(iconsWithSvg)

    // For partial updates (--only), merge with existing files
    // For full updates, write complete new files
    if (onlyIcons && onlyIcons.length > 0) {
      // Partial update: preserve existing icons, update only specified ones
      mergeJsonData(iconsWithSvg)
      mergeTypeScriptData(iconsWithSvg)
    } else {
      // Full update: replace entire files
      writeJsonData(iconsWithSvg)
      writeTypeScriptData(iconsWithSvg)
    }
    endTimer('writeFiles')

    console.info('')
    console.info('✅ Done! Icons exported successfully.')
    endTimer('total')
  } catch (error) {
    console.error('❌ Error:', error.message)
    // In debug mode, show full stack trace for troubleshooting
    if (DEBUG) console.error(error.stack)
    process.exit(1)
  }
}

// =============================================================================
// SCRIPT EXECUTION
// =============================================================================

// Run the main function (top-level await is supported in ES modules)
main()
