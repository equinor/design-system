import { existsSync } from 'node:fs'
import path from 'node:path'

import type { TokenConfig } from './utils'
import {
  loadTokenConfig,
  readJson,
  DEFAULT_EXTENSIONS,
  writeJson,
} from './utils'

type Json = Record<string, unknown>

interface TokenValue {
  $value?: unknown
  $type?: string
  $description?: string
  $extensions?: Record<string, unknown>
}

function makeRef(mode: 'Light' | 'Dark', group: string, key: string) {
  return `{${mode}.${group}.${key}}`
}

function generateSchemeFromPalette(
  paletteRoot: Json,
  mode: 'Light' | 'Dark',
): Json {
  const out: Json = {}
  for (const groupName of Object.keys(paletteRoot)) {
    const group = paletteRoot[groupName]
    if (group && typeof group === 'object') {
      const groupOut: Json = {}
      for (const key of Object.keys(group)) {
        groupOut[key] = {
          $type: 'color',
          $value: makeRef(mode, groupName, key),
          $description: '',
          $extensions: DEFAULT_EXTENSIONS,
        }
      }
      out[groupName] = groupOut
    }
  }
  return out
}

function isRefString(v: unknown): v is string {
  return typeof v === 'string' && /^\{(Light|Dark)\.[^}]+\}$/.test(v)
}

function mirrorRefValue(value: string, targetMode: 'Light' | 'Dark'): string {
  if (targetMode === 'Light') return value.replace(/^\{Dark\./, '{Light.')
  return value.replace(/^\{Light\./, '{Dark.')
}

function collectTopLevelExtras(
  obj: Json | undefined,
  groupKeys: Set<string>,
): Record<string, unknown> {
  if (!obj) return {}
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (!groupKeys.has(k)) out[k] = v
  }
  return out
}

function mergeExtrasBothModes(
  baseGenerated: Json,
  existingLight: Json | undefined,
  existingDark: Json | undefined,
  mode: 'Light' | 'Dark',
  groupKeys: Set<string>,
): Json {
  const out: Json = { ...baseGenerated }
  const lightExtras = collectTopLevelExtras(existingLight, groupKeys)
  const darkExtras = collectTopLevelExtras(existingDark, groupKeys)
  const extraKeys = new Set([
    ...Object.keys(lightExtras),
    ...Object.keys(darkExtras),
  ])

  for (const key of extraKeys) {
    // If this key was already generated (e.g., from concept template), do not override it with existing extras
    if (Object.prototype.hasOwnProperty.call(out, key)) {
      continue
    }
    const src = mode === 'Light' ? lightExtras[key] : darkExtras[key]
    const fallback = mode === 'Light' ? darkExtras[key] : lightExtras[key]

    let finalEntry = src
    if (!finalEntry && fallback && typeof fallback === 'object') {
      // Try to mirror the reference between modes if the $value is a token reference
      const tokenFallback = fallback as TokenValue
      const val = tokenFallback.$value
      if (isRefString(val)) {
        finalEntry = {
          $type: tokenFallback.$type ?? 'color',
          $value: mirrorRefValue(val, mode),
          $description: tokenFallback.$description ?? '',
          $extensions: tokenFallback.$extensions ?? DEFAULT_EXTENSIONS,
        }
      }
    }

    if (finalEntry) {
      out[key] = finalEntry
    }
  }
  return out
}

function resolveConceptValue(
  raw: string,
  mode: 'Light' | 'Dark',
  mappings?: TokenConfig['conceptColorGroups'],
): string {
  // raw can be a placeholder like {bg-floating} or already a ref like {Light.Gray.2}
  const placeholderMatch = raw.match(/^\{([^}.]+(?:-[^}.]+)*)\}$/)
  const refMatch = raw.match(/^\{(Light|Dark)\.[^}]+\}$/)
  if (refMatch) return raw // already a ref
  if (!placeholderMatch) return raw // not in braces, leave as-is
  const key = placeholderMatch[1]
  if (!mappings) return raw
  const mapVal = mappings[key]
  if (!mapVal) return raw
  if (typeof mapVal === 'string') return mapVal // assume full ref string
  const perMode = mapVal[mode]
  return typeof perMode === 'string' ? perMode : raw
}

function injectConceptsFromMappings(
  generated: Json,
  mode: 'Light' | 'Dark',
  mappings?: TokenConfig['conceptColorGroups'],
): Json {
  if (!mappings || Object.keys(mappings).length === 0) return generated
  const out: Json = { ...generated }

  const groupLabel = (area: string) => {
    const a = area.toLowerCase()
    if (a === 'bg') return 'Bg'
    if (a === 'border') return 'Border'
    if (a === 'text') return 'Text'
    return area.charAt(0).toUpperCase() + area.slice(1)
  }
  const tokenLabel = (slug: string) =>
    slug
      .split('-')
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')

  const cfg = loadTokenConfig()
  const varPrefix = (cfg.variablePrefix ?? 'x').trim()
  const buildVar = (suffix: string) => `var(--${varPrefix}-color-${suffix})`

  for (const key of Object.keys(mappings)) {
    const [area, ...rest] = key.split('-')
    if (!area || rest.length === 0) continue
    const grpKey = groupLabel(area)
    const tokenKey = tokenLabel(rest.join('-'))
    const raw = `{${key}}`
    const resolved = resolveConceptValue(raw, mode, mappings)
    if (typeof resolved !== 'string') continue

    const suffix = `${area.toLowerCase()}-${rest.join('-')}`
    const extensions = {
      ...DEFAULT_EXTENSIONS,
      'com.figma': {
        ...DEFAULT_EXTENSIONS['com.figma'],
        codeSyntax: { WEB: buildVar(suffix) },
      },
    }

    if (!out[grpKey]) out[grpKey] = {}
    const group = out[grpKey] as Record<string, unknown>
    group[tokenKey] = {
      $type: 'color',
      $value: resolved,
      $description: '',
      $extensions: extensions,
    }
  }
  return out
}

async function generate(cfg: TokenConfig) {
  const tokenConfig = cfg || {}

  const FIGMA_PROJECT_ID = (tokenConfig.figmaProjectFoundationId ?? '').trim()
  if (!FIGMA_PROJECT_ID) {
    console.error(
      'Missing figmaProjectFoundationId. Set it in token-config.json (figmaProjectFoundationId).',
    )
    process.exit(1)
  }

  const SCHEME_TOKENS_PREFIX =
    tokenConfig.schemeTokensPrefix ?? '🌗 Color Scheme'
  const TOKEN_BASE = path.join('tokens', FIGMA_PROJECT_ID)
  const LIGHT_COLORS = path.join(TOKEN_BASE, 'Color Light.Mode 1.json')
  const DARK_COLORS = path.join(TOKEN_BASE, 'Color Dark.Mode 1.json')
  const LIGHT_SCHEME = path.join(
    TOKEN_BASE,
    `${SCHEME_TOKENS_PREFIX}.Light.json`,
  )
  const DARK_SCHEME = path.join(TOKEN_BASE, `${SCHEME_TOKENS_PREFIX}.Dark.json`)

  // Read palettes
  const [lightPalette, darkPalette] = await Promise.all([
    readJson<Json>(LIGHT_COLORS),
    readJson<Json>(DARK_COLORS),
  ])

  const lightRoot = lightPalette['Light'] as Json | undefined
  const darkRoot = darkPalette['Dark'] as Json | undefined
  if (!lightRoot || !darkRoot) {
    console.error(
      "Palette files did not include expected 'Light'/'Dark' top-level keys.",
    )
    process.exit(1)
  }

  // Generate from palette groups
  const generatedLight = generateSchemeFromPalette(lightRoot, 'Light')
  const generatedDark = generateSchemeFromPalette(darkRoot, 'Dark')

  // Inject concept groups (Bg/Border/Text/...) directly from conceptColorGroups
  const withConceptsLight = injectConceptsFromMappings(
    generatedLight,
    'Light',
    tokenConfig.conceptColorGroups,
  )
  const withConceptsDark = injectConceptsFromMappings(
    generatedDark,
    'Dark',
    tokenConfig.conceptColorGroups,
  )

  // Optionally merge non-group keys from existing scheme files to preserve custom tokens
  const existingLight = existsSync(LIGHT_SCHEME)
    ? await readJson<Json>(LIGHT_SCHEME)
    : undefined
  const existingDark = existsSync(DARK_SCHEME)
    ? await readJson<Json>(DARK_SCHEME)
    : undefined

  const groupKeys = new Set(Object.keys(lightRoot))
  const finalLight = mergeExtrasBothModes(
    withConceptsLight,
    existingLight,
    existingDark,
    'Light',
    groupKeys,
  )
  const finalDark = mergeExtrasBothModes(
    withConceptsDark,
    existingLight,
    existingDark,
    'Dark',
    groupKeys,
  )

  // Write outputs
  await Promise.all([
    writeJson(LIGHT_SCHEME, finalLight),
    writeJson(DARK_SCHEME, finalDark),
  ])

  console.log(
    `Generated color schemes:\n  - ${path.relative(process.cwd(), LIGHT_SCHEME)}\n  - ${path.relative(process.cwd(), DARK_SCHEME)}`,
  )
}

async function main() {
  const cfg = loadTokenConfig()
  await generate(cfg)
}

main().catch((err) => {
  console.error('[generate-color-scheme-tokens] Failed:')
  console.error(err)
  process.exit(1)
})
