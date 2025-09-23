#!/usr/bin/env node
import path from 'node:path'

import type { TokenConfig } from './utils'
import {
  loadTokenConfig,
  writeJson,
  isObject,
  DEFAULT_EXTENSIONS,
  validatePaletteFamilies,
} from './utils'

type Json = Record<string, any>

function buildToken($value: string, $description = '', webVar?: string) {
  return {
    $type: 'color',
    $value,
    $description,
    $extensions: {
      ...DEFAULT_EXTENSIONS,
      'com.figma': {
        ...DEFAULT_EXTENSIONS['com.figma'],
        codeSyntax: webVar ? { WEB: webVar } : {},
      },
    },
  }
}

// Build the semantic tree per the mapping
function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+on\s+/g, '-on-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function varName(prefix: string, area: string, intent: string, slot: string) {
  return `var(--${prefix}-color-${area}-${intent}-${slot})`
}

function generateSemantic(
  mapping: Record<string, string>,
  variablePrefix: string,
): Json {
  const make = (ref: string, desc = '', web?: string) =>
    buildToken(ref, desc, web)

  const sections: Json = { Bg: {}, Border: {}, Text: {} }

  const textDescriptions = {
    Subtle: 'Used for text and icons',
    Strong: 'Used for text and icons',
    'Subtle on emphasis': 'Text or icons against colored backgrounds',
    'Strong on emphasis': 'Text or icons against colored backgrounds',
  } as const

  for (const [semantic, palette] of Object.entries(mapping)) {
    const intent = slug(semantic)
    // BG names
    const bgCanvas = varName(variablePrefix, 'bg', intent, 'canvas')
    const bgSurface = varName(variablePrefix, 'bg', intent, 'surface')
    const bgFillMutedDefault = varName(
      variablePrefix,
      'bg',
      intent,
      'fill-muted-default',
    )
    const bgFillMutedHover = varName(
      variablePrefix,
      'bg',
      intent,
      'fill-muted-hover',
    )
    const bgFillMutedActive = varName(
      variablePrefix,
      'bg',
      intent,
      'fill-muted-active',
    )
    const bgFillEmphasisDefault = varName(
      variablePrefix,
      'bg',
      intent,
      'fill-emphasis-default',
    )
    const bgFillEmphasisHover = varName(
      variablePrefix,
      'bg',
      intent,
      'fill-emphasis-hover',
    )
    const bgFillEmphasisActive = varName(
      variablePrefix,
      'bg',
      intent,
      'fill-emphasis-active',
    )

    // BORDER names
    const borderSubtle = varName(variablePrefix, 'border', intent, 'subtle')
    const borderMedium = varName(variablePrefix, 'border', intent, 'medium')
    const borderStrong = varName(variablePrefix, 'border', intent, 'strong')

    // TEXT names
    const textSubtle = varName(variablePrefix, 'text', intent, 'subtle')
    const textStrong = varName(variablePrefix, 'text', intent, 'strong')
    const textSubtleOnEmphasis = varName(
      variablePrefix,
      'text',
      intent,
      'subtle-on-emphasis',
    )
    const textStrongOnEmphasis = varName(
      variablePrefix,
      'text',
      intent,
      'strong-on-emphasis',
    )
    // BG
    sections.Bg[semantic] = {
      Canvas: make(`{${palette}.1}`, '', bgCanvas),
      Surface: make(`{${palette}.2}`, '', bgSurface),
      'Fill Muted': {
        Default: make(`{${palette}.3}`, '', bgFillMutedDefault),
        Hover: make(`{${palette}.4}`, '', bgFillMutedHover),
        Active: make(`{${palette}.5}`, '', bgFillMutedActive),
      },
      'Fill Emphasis': {
        Default: make(`{${palette}.9}`, '', bgFillEmphasisDefault),
        Hover: make(`{${palette}.10}`, '', bgFillEmphasisHover),
        Active: make(`{${palette}.11}`, '', bgFillEmphasisActive),
      },
    }

    // BORDER
    sections.Border[semantic] = {
      Subtle: make(`{${palette}.6}`, '', borderSubtle),
      Medium: make(`{${palette}.7}`, '', borderMedium),
      Strong: make(`{${palette}.8}`, '', borderStrong),
    }

    // TEXT
    sections.Text[semantic] = {
      Subtle: make(`{${palette}.12}`, textDescriptions.Subtle, textSubtle),
      Strong: make(`{${palette}.13}`, textDescriptions.Strong, textStrong),
      'Subtle on emphasis': make(
        `{${palette}.14}`,
        textDescriptions['Subtle on emphasis'],
        textSubtleOnEmphasis,
      ),
      'Strong on emphasis': make(
        `{${palette}.15}`,
        textDescriptions['Strong on emphasis'],
        textStrongOnEmphasis,
      ),
    }
  }

  return sections
}

async function generate(cfg: TokenConfig) {
  const tokenConfig = cfg || {}
  const foundationId = (tokenConfig.figmaProjectFoundationId ?? '').trim()
  const staticId = (tokenConfig.figmaProjectStaticId ?? '').trim()
  if (!foundationId) {
    console.error(
      'Missing figmaProjectFoundationId. Set it in token-config.json (figmaProjectFoundationId).',
    )
    process.exit(1)
  }
  if (!staticId) {
    console.error(
      'Missing figmaProjectStaticId. Set it in token-config.json (figmaProjectStaticId).',
    )
    process.exit(1)
  }

  const mapping = tokenConfig.semanticColorCategories
  if (!isObject(mapping) || Object.keys(mapping).length === 0) {
    console.error('Missing semanticColorCategories in token-config.json.')
    process.exit(1)
  }

  const variablePrefix = (tokenConfig.variablePrefix ?? 'x').trim()

  // Validate that mapped palette families exist in light palette (warning-only)
  await validatePaletteFamilies(
    foundationId,
    mapping as Record<string, string>,
    'generate-semantic-tokens',
  )

  const SEMANTIC_FILE = path.join('tokens', staticId, 'Semantic.Mode 1.json')

  const semanticJson = generateSemantic(
    mapping as Record<string, string>,
    variablePrefix,
  )

  await writeJson(SEMANTIC_FILE, semanticJson)
  console.log(
    `Generated semantic tokens: ${path.relative(process.cwd(), SEMANTIC_FILE)}`,
  )
}

async function main() {
  const cfg = loadTokenConfig()
  await generate(cfg)
}

main().catch((err) => {
  console.error('[generate-semantic-tokens] Failed:')
  console.error(err)
  process.exit(1)
})
