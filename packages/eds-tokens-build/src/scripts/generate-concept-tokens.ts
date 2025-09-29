import path from 'node:path'

import type { TokenConfig } from './utils'
import {
  loadTokenConfig,
  writeJson,
  isObject,
  DEFAULT_EXTENSIONS,
} from './utils'

type Json = Record<string, unknown>

async function generate(cfg: TokenConfig) {
  const tokenConfig = cfg || {}
  const staticId = (tokenConfig.figmaProjectStaticId ?? '').trim()
  const dynamicId = (tokenConfig.figmaProjectDynamicId ?? '').trim()

  if (!staticId && !dynamicId) {
    console.error(
      'Missing figmaProjectStaticId and figmaProjectDynamicId. Set at least one in token-config.json.',
    )
    process.exit(1)
  }

  const mappings = tokenConfig.conceptColorGroups || {}
  if (!isObject(mappings) || Object.keys(mappings).length === 0) {
    console.error('Missing conceptColorGroups in token-config.json.')
    process.exit(1)
  }

  // Build a template structure with groups (Bg, Border, Text) but reference flat tokens
  // Example keys: bg-floating, border-focus, text-link
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

  const varPrefix = (tokenConfig.variablePrefix ?? 'x').trim()
  const buildVar = (suffix: string) => `var(--${varPrefix}-color-${suffix})`

  const template: Json = {}
  for (const key of Object.keys(mappings)) {
    const [area, ...rest] = key.split('-')
    if (!area || rest.length === 0) continue // skip malformed keys
    const grp = groupLabel(area)
    const name = tokenLabel(rest.join('-'))
    if (!template[grp]) template[grp] = {}
    const group = template[grp] as Record<string, unknown>

    // Reference the flat token structure from color scheme files
    // The concept tokens should reference the flat tokens like: {bg-floating}, {border-focus}, {text-link}
    group[name] = {
      $type: 'color',
      $value: `{${key}}`,
      $description: '',
      $extensions: {
        ...DEFAULT_EXTENSIONS,
        'com.figma': {
          ...DEFAULT_EXTENSIONS['com.figma'],
          codeSyntax: { WEB: buildVar(key) },
        },
      },
    }
  }

  // Write to both Static and Dynamic token folders (if configured)
  const outputs: string[] = []
  if (staticId)
    outputs.push(path.join('tokens', staticId, 'Concept.Mode 1.json'))
  if (dynamicId)
    outputs.push(path.join('tokens', dynamicId, 'Concept.Mode 1.json'))

  await Promise.all(
    outputs.map((out) => writeJson(out, template).then(() => out)),
  )

  for (const out of outputs) {
    console.log(
      `Generated concept tokens: ${path.relative(process.cwd(), out)}`,
    )
  }
}

async function main() {
  const cfg = loadTokenConfig()
  await generate(cfg)
}

main().catch((err) => {
  console.error('[generate-concept-tokens] Failed:')
  console.error(err)
  process.exit(1)
})
