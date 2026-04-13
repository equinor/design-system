import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

import { loadTokenConfig, readJson, isObject } from './utils'

type ShadowLayer = {
  color: string
  offsetX: number
  offsetY: number
  blur: number
  spread: number
}

function extractLayer(group: Record<string, unknown>): ShadowLayer | undefined {
  if (!isObject(group)) return undefined

  const colorToken = group['color'] as { $value?: string } | undefined
  const offsetXToken = group['offset-x'] as { $value?: number } | undefined
  const offsetYToken = group['offset-y'] as { $value?: number } | undefined
  const blurToken = group['blur'] as { $value?: number } | undefined
  const spreadToken = group['spread'] as { $value?: number } | undefined

  if (!colorToken?.$value) return undefined

  return {
    color: colorToken.$value,
    offsetX: offsetXToken?.$value ?? 0,
    offsetY: offsetYToken?.$value ?? 0,
    blur: blurToken?.$value ?? 0,
    spread: spreadToken?.$value ?? 0,
  }
}

function hexToRgba(hex: string): string {
  const clean = hex.replace('#', '')
  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    const a = parseInt(clean.slice(6, 8), 16) / 255
    return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  return hex
}

function composeShadow(key: ShadowLayer, ambient: ShadowLayer): string {
  const fmt = (l: ShadowLayer) =>
    `${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color)}`
  return `${fmt(key)}, ${fmt(ambient)}`
}

async function buildElevation() {
  const cfg = loadTokenConfig()
  const foundationId = cfg.figmaProjectFoundationId ?? ''
  const prefix = cfg.variablePrefix ?? 'eds'

  const tokenPath = path.resolve(
    'tokens',
    foundationId,
    'Elevation.Mode 1.json',
  )

  if (!existsSync(tokenPath)) {
    console.error(`Elevation token file not found: ${tokenPath}`)
    process.exit(1)
  }

  const tokens = await readJson<Record<string, unknown>>(tokenPath)
  const shadow = tokens['Shadow'] as Record<string, unknown> | undefined

  if (!shadow) {
    console.error('No "Shadow" group found in elevation tokens')
    process.exit(1)
  }

  const levels = ['Low', 'High'] as const
  const vars: string[] = []

  for (const level of levels) {
    const group = shadow[level] as Record<string, unknown> | undefined
    if (!group) {
      console.warn(`Shadow/${level} not found, skipping`)
      continue
    }

    const key = extractLayer(group['Key'] as Record<string, unknown>)
    const ambient = extractLayer(group['Ambient'] as Record<string, unknown>)

    if (!key || !ambient) {
      console.warn(`Shadow/${level} missing Key or Ambient layer, skipping`)
      continue
    }

    const varName = `--${prefix}-elevation-${level.toLowerCase()}`
    vars.push(`  ${varName}: ${composeShadow(key, ambient)};`)
  }

  // Generate TypeScript output
  type ElevationEntry = {
    key: ShadowLayer
    ambient: ShadowLayer
    level: string
  }
  const entries: ElevationEntry[] = []

  for (const level of levels) {
    const group = shadow[level] as Record<string, unknown> | undefined
    if (!group) continue
    const key = extractLayer(group['Key'] as Record<string, unknown>)
    const ambient = extractLayer(group['Ambient'] as Record<string, unknown>)
    if (key && ambient) entries.push({ key, ambient, level })
  }

  const tsDir = path.resolve('build', 'ts', 'elevation')
  if (!existsSync(tsDir)) mkdirSync(tsDir, { recursive: true })

  const hexToOpacity = (hex: string): number => {
    const clean = hex.replace('#', '')
    if (clean.length === 8) {
      return Number((parseInt(clean.slice(6, 8), 16) / 255).toFixed(2))
    }
    return 1
  }

  const tsLines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    'export const elevation = {',
  ]

  for (const { key, ambient, level } of entries) {
    const name = level.toLowerCase()
    tsLines.push(`  ${name}: {`)
    tsLines.push(`    boxShadow: '${composeShadow(key, ambient)}',`)
    tsLines.push(`    key: {`)
    tsLines.push(`      shadowColor: '#000',`)
    tsLines.push(`      shadowOffset: {`)
    tsLines.push(`        width: ${key.offsetX},`)
    tsLines.push(`        height: ${key.offsetY},`)
    tsLines.push(`      },`)
    tsLines.push(`      shadowOpacity: ${hexToOpacity(key.color)},`)
    tsLines.push(`      shadowRadius: ${key.blur},`)
    tsLines.push(`      spread: ${key.spread},`)
    tsLines.push(`    },`)
    tsLines.push(`    ambient: {`)
    tsLines.push(`      shadowColor: '#000',`)
    tsLines.push(`      shadowOffset: {`)
    tsLines.push(`        width: ${ambient.offsetX},`)
    tsLines.push(`        height: ${ambient.offsetY},`)
    tsLines.push(`      },`)
    tsLines.push(`      shadowOpacity: ${hexToOpacity(ambient.color)},`)
    tsLines.push(`      shadowRadius: ${ambient.blur},`)
    tsLines.push(`      spread: ${ambient.spread},`)
    tsLines.push(`    },`)
    tsLines.push(`  },`)
  }
  tsLines.push('} as const')
  tsLines.push('')

  const tsPath = path.join(tsDir, 'elevation.ts')
  await writeFile(tsPath, tsLines.join('\n'), 'utf8')
  console.log(`Wrote ${tsPath}`)

  const css = `:root {\n${vars.join('\n')}\n}\n`

  const outDir = path.resolve('build', 'css', 'elevation')
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }

  const outPath = path.join(outDir, 'elevation.css')
  await writeFile(outPath, css, 'utf8')
  console.log(`Wrote ${outPath}`)
}

export async function run() {
  await buildElevation()
}

await run()
