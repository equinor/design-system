import path from 'node:path'

import type { TokenConfig } from './utils'
import {
  loadTokenConfig,
  writeJson,
  isObject,
  validatePaletteFamilies,
  buildToken,
  varName,
} from './utils'

function generateAppearanceForSemantic(
  semantic: string,
  variablePrefix: string,
): Record<string, unknown> {
  const make = (ref: string, desc = '', web?: string) =>
    buildToken(ref, desc, web)

  const textDescriptions = {
    Subtle: 'Used for text and icons',
    Strong: 'Used for text and icons',
    'Subtle on emphasis': 'Text or icons against colored backgrounds',
    'Strong on emphasis': 'Text or icons against colored backgrounds',
  } as const

  // Build WEB var names
  const bgCanvas = varName(variablePrefix, 'bg', 'canvas')
  const bgSurface = varName(variablePrefix, 'bg', 'surface')
  const bgFillMutedDefault = varName(variablePrefix, 'bg', 'fill-muted-default')
  const bgFillMutedHover = varName(variablePrefix, 'bg', 'fill-muted-hover')
  const bgFillMutedActive = varName(variablePrefix, 'bg', 'fill-muted-active')
  const bgFillEmphasisDefault = varName(
    variablePrefix,
    'bg',
    'fill-emphasis-default',
  )
  const bgFillEmphasisHover = varName(
    variablePrefix,
    'bg',
    'fill-emphasis-hover',
  )
  const bgFillEmphasisActive = varName(
    variablePrefix,
    'bg',
    'fill-emphasis-active',
  )

  const borderSubtle = varName(variablePrefix, 'border', 'subtle')
  const borderMedium = varName(variablePrefix, 'border', 'medium')
  const borderStrong = varName(variablePrefix, 'border', 'strong')

  const textSubtle = varName(variablePrefix, 'text', 'subtle')
  const textStrong = varName(variablePrefix, 'text', 'strong')
  const textSubtleOnEmphasis = varName(
    variablePrefix,
    'text',
    'contrast-subtle',
  )
  const textStrongOnEmphasis = varName(
    variablePrefix,
    'text',
    'contrast-strong',
  )

  return {
    Bg: {
      Fill: {
        Muted: {
          Default: make(`{${semantic}.3}`, '', bgFillMutedDefault),
          Hover: make(`{${semantic}.4}`, '', bgFillMutedHover),
          Active: make(`{${semantic}.5}`, '', bgFillMutedActive),
        },
        Emphasis: {
          Default: make(`{${semantic}.9}`, '', bgFillEmphasisDefault),
          Hover: make(`{${semantic}.10}`, '', bgFillEmphasisHover),
          Active: make(`{${semantic}.11}`, '', bgFillEmphasisActive),
        },
      },
      Canvas: make(`{${semantic}.1}`, '', bgCanvas),
      Surface: make(`{${semantic}.2}`, '', bgSurface),
    },
    Border: {
      Subtle: make(`{${semantic}.6}`, '', borderSubtle),
      Medium: make(`{${semantic}.7}`, '', borderMedium),
      Strong: make(`{${semantic}.8}`, '', borderStrong),
    },
    Text: {
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
    },
  } as Record<string, unknown>
}

async function generate(cfg: TokenConfig) {
  const tokenConfig = cfg || {}

  const foundationId = (tokenConfig.figmaProjectFoundationId ?? '').trim()
  const dynamicId = (tokenConfig.figmaProjectDynamicId ?? '').trim()
  if (!foundationId) {
    console.error(
      'Missing figmaProjectFoundationId. Set it in token-config.json (figmaProjectFoundationId).',
    )
    process.exit(1)
  }
  if (!dynamicId) {
    console.error(
      'Missing figmaProjectDynamicId. Set it in token-config.json (figmaProjectDynamicId).',
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
    'generate-dynamic-appearance-tokens',
  )

  const outDir = path.join('tokens', dynamicId)

  for (const semantic of Object.keys(colorSchemeConfig)) {
    // File name with emoji prefix
    const fileName = `🎨 Appearance.${semantic}.json`
    const filePath = path.join(outDir, fileName)

    const appearanceJson = generateAppearanceForSemantic(
      semantic,
      variablePrefix,
    )

    await writeJson(filePath, appearanceJson)
    console.log(`Generated: ${path.relative(process.cwd(), filePath)}`)
  }
}

async function main() {
  const cfg = loadTokenConfig()
  await generate(cfg)
}

main().catch((err) => {
  console.error('[generate-dynamic-appearance-tokens] Failed:')
  console.error(err)
  process.exit(1)
})
