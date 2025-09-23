import path from 'node:path'

import type { TokenConfig } from './utils'
import {
  loadTokenConfig,
  writeJson,
  isObject,
  DEFAULT_EXTENSIONS,
} from './utils'

type Json = Record<string, unknown>

// Derive a generic WEB var from placeholder structure: {area}-{name}
function webVarFromPlaceholder(placeholder: string): string | undefined {
  const [area, ...rest] = placeholder.split('-')
  if (!area || rest.length === 0) return undefined
  const name = rest.join('-')
  return `var(--color-${area}-${name})`
}

function extractPlaceholder(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const m = value.match(/^\{([^}]+)\}$/)
  return m ? m[1] : null
}

function applyCodeSyntax(template: Json): Json {
  function visit(node: unknown): unknown {
    if (!isObject(node)) return node

    const nodeObj = node

    // If this node looks like a token leaf
    if (
      typeof nodeObj.$type === 'string' &&
      Object.prototype.hasOwnProperty.call(nodeObj, '$value')
    ) {
      const placeholder = extractPlaceholder(nodeObj.$value)
      const webVar = placeholder
        ? webVarFromPlaceholder(placeholder)
        : undefined
      const codeSyntax = webVar ? { WEB: webVar } : {}

      const prevExt = (nodeObj.$extensions as Record<string, unknown>) ?? {}
      const prevFigma =
        (prevExt && (prevExt['com.figma'] as Record<string, unknown>)) || {}
      return {
        ...nodeObj,
        $extensions: {
          ...DEFAULT_EXTENSIONS,
          'com.figma': {
            ...DEFAULT_EXTENSIONS['com.figma'],
            ...prevFigma,
            codeSyntax,
          },
        },
      }
    }

    // Otherwise, recurse into object properties
    const out: Record<string, unknown> = Array.isArray(nodeObj) ? {} : {}
    for (const [k, v] of Object.entries(nodeObj)) {
      out[k] = visit(v)
    }
    return out
  }

  return visit(template) as Json
}

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

  const mappings =
    tokenConfig.conceptColorGroups || tokenConfig.conceptMappings || {}
  if (!isObject(mappings) || Object.keys(mappings).length === 0) {
    console.error('Missing conceptColorGroups in token-config.json.')
    process.exit(1)
  }

  // Build a template structure directly from conceptColorGroups keys
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

  const template: Json = {}
  for (const key of Object.keys(mappings)) {
    const [area, ...rest] = key.split('-')
    if (!area || rest.length === 0) continue // skip malformed keys
    const grp = groupLabel(area)
    const name = tokenLabel(rest.join('-'))
    if (!template[grp]) template[grp] = {}
    const group = template[grp] as Record<string, unknown>
    group[name] = {
      $type: 'color',
      $value: `{${key}}`,
      $description: '',
      $extensions: DEFAULT_EXTENSIONS,
    }
  }

  // Apply WEB code syntax mapping per placeholder
  const finalJson = applyCodeSyntax(template)

  // Write to both Static and Dynamic token folders (if configured)
  const outputs: string[] = []
  if (staticId)
    outputs.push(path.join('tokens', staticId, 'Concept.Mode 1.json'))
  if (dynamicId)
    outputs.push(path.join('tokens', dynamicId, 'Concept.Mode 1.json'))

  await Promise.all(
    outputs.map((out) => writeJson(out, finalJson).then(() => out)),
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
