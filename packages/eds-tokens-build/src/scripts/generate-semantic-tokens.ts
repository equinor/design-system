import path from 'node:path'

import type { TokenConfig } from './utils'
import {
  loadTokenConfig,
  writeJson,
  isObject,
  DEFAULT_EXTENSIONS,
  validatePaletteFamilies,
} from './utils'

type Json = Record<string, unknown>

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
  colorSchemeConfig: Record<string, { Light: string; Dark: string }>,
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

  for (const semantic of Object.keys(colorSchemeConfig)) {
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

    // Reference color scheme tokens directly by semantic name

    // BG
    const bgSection = sections.Bg as Record<string, unknown>
    bgSection[semantic] = {
      Canvas: make(`{${semantic}.1}`, '', bgCanvas),
      Surface: make(`{${semantic}.2}`, '', bgSurface),
      'Fill Muted': {
        Default: make(`{${semantic}.3}`, '', bgFillMutedDefault),
        Hover: make(`{${semantic}.4}`, '', bgFillMutedHover),
        Active: make(`{${semantic}.5}`, '', bgFillMutedActive),
      },
      'Fill Emphasis': {
        Default: make(`{${semantic}.9}`, '', bgFillEmphasisDefault),
        Hover: make(`{${semantic}.10}`, '', bgFillEmphasisHover),
        Active: make(`{${semantic}.11}`, '', bgFillEmphasisActive),
      },
    }

    // BORDER
    const borderSection = sections.Border as Record<string, unknown>
    borderSection[semantic] = {
      Subtle: make(`{${semantic}.6}`, '', borderSubtle),
      Medium: make(`{${semantic}.7}`, '', borderMedium),
      Strong: make(`{${semantic}.8}`, '', borderStrong),
    }

    // TEXT
    const textSection = sections.Text as Record<string, unknown>
    textSection[semantic] = {
      Subtle: make(`{${semantic}.12}`, textDescriptions.Subtle, textSubtle),
      Strong: make(`{${semantic}.13}`, textDescriptions.Strong, textStrong),
      'Subtle on emphasis': make(
        `{${semantic}.14}`,
        textDescriptions['Subtle on emphasis'],
        textSubtleOnEmphasis,
      ),
      'Strong on emphasis': make(
        `{${semantic}.15}`,
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

  const colorSchemeConfig = tokenConfig.colorSchemeConfig
  if (
    !isObject(colorSchemeConfig) ||
    Object.keys(colorSchemeConfig).length === 0
  ) {
    console.error('Missing colorSchemeConfig in token-config.json.')
    process.exit(1)
  }

  const variablePrefix = (tokenConfig.variablePrefix ?? 'x').trim()

  // Validate that mapped palette families exist in light palette (warning-only)
  const paletteValidationMap = Object.fromEntries(
    Object.entries(colorSchemeConfig).map(([semantic, config]) => [
      semantic,
      config.Light,
    ]),
  )
  await validatePaletteFamilies(
    foundationId,
    paletteValidationMap,
    'generate-semantic-tokens',
  )

  const SEMANTIC_FILE = path.join('tokens', staticId, 'Semantic.Mode 1.json')

  const semanticJson = generateSemantic(colorSchemeConfig, variablePrefix)

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
