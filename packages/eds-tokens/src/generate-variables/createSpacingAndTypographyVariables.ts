import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import {
  includeTokenFilter,
  createDensitySpaceToggleTransform,
} from '@equinor/eds-tokens-build'
import { readJsonFiles } from '@equinor/eds-tokens-sync'

export const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
export const FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES = 'FQQqyumcpPQoiFRCjdS9GM'

export async function createSpacingAndTypographyVariables({
  tokensDir,
  cssBuildPath,
  cssTransforms,
}: {
  tokensDir: string
  cssBuildPath: string
  cssTransforms: string[]
}) {
  const prefix = 'eds'
  const spacingBuildPath = 'spacing/'

  const SPACING_PRIMITIVE_SOURCE = path.join(
    tokensDir,
    FILE_KEY_SPACING,
    '👾 Primitives.Value.json',
  )
  const DENSITY_FIGMA_SOURCE = path.join(
    tokensDir,
    FILE_KEY_SPACING,
    '⛔️ Figma.Value.json',
  )
  const DENSITY_SPACIOUS_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '💎 Density.Spacious.json',
  )
  const DENSITY_COMFORTABLE_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '💎 Density.Comfortable.json',
  )

  const spacingComfortableTokens = readJsonFiles([
    path.join(
      tokensDir,
      FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
      '💎 Density.Comfortable.json',
    ),
  ])
  const densitySpaceToggleTransform = createDensitySpaceToggleTransform({
    name: 'densitySpaceToggle',
    tokens: spacingComfortableTokens['💎 Density.Comfortable.json'],
  })

  StyleDictionary.registerTransform(densitySpaceToggleTransform)

  const outputDirectory = path.resolve(process.cwd(), 'build')
  const jsBuildPath = path.join(outputDirectory, 'js')
  const jsonBuildPath = path.join(outputDirectory, 'json')

  const densitySpaciousFilter = (token: TransformedToken) =>
    includeTokenFilter(token, ['Density', 'Spacious'])
  const densityComfortableFilter = (token: TransformedToken) =>
    includeTokenFilter(token, ['Density', 'Comfortable'])

  const spacious = new StyleDictionary({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      ts: {
        transforms: ['name/constant'],
        buildPath: jsBuildPath,
        files: [
          {
            filter: densitySpaciousFilter,
            destination: 'spacing/spacious.js',
            format: 'javascript/es6',
          },
          {
            filter: densitySpaciousFilter,
            format: 'typescript/es6-declarations',
            destination: 'spacing/spacious.d.ts',
          },
        ],
      },
      json: {
        buildPath: jsonBuildPath,
        transforms: ['name/kebab'],
        files: [
          {
            filter: densitySpaciousFilter,
            destination: 'spacing/flat/spacious.json',
            format: 'json/flat',
          },
          {
            filter: densitySpaciousFilter,
            destination: 'spacing/nested/spacious.json',
            format: 'json/nested',
          },
        ],
      },
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Density', 'Spacious']),
            destination: 'spacious.css',
            format: 'css/variables',
            options: {
              selector: ':root, [data-density="spacious"]',
              outputReferences: false,
            },
          },
        ],
      },
    },
  })

  const comfortable = new StyleDictionary({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_COMFORTABLE_SOURCE],
    platforms: {
      ts: {
        transforms: ['name/constant'],
        buildPath: jsBuildPath,
        files: [
          {
            filter: densityComfortableFilter,
            destination: 'spacing/comfortable.js',
            format: 'javascript/es6',
          },
          {
            filter: densityComfortableFilter,
            format: 'typescript/es6-declarations',
            destination: 'spacing/comfortable.d.ts',
          },
        ],
      },
      json: {
        buildPath: jsonBuildPath,
        transforms: ['name/kebab'],
        files: [
          {
            filter: densityComfortableFilter,
            destination: 'spacing/flat/comfortable.json',
            format: 'json/flat',
          },
          {
            filter: densityComfortableFilter,
            destination: 'spacing/nested/comfortable.json',
            format: 'json/nested',
          },
        ],
      },
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Density', 'Comfortable']),
            destination: 'comfortable.css',
            format: 'css/variables',
            options: {
              selector: '[data-density="comfortable"]',
              outputReferences: false,
            },
          },
        ],
      },
    },
  })

  await spacious.buildAllPlatforms()
  await comfortable.buildAllPlatforms()

  const FIGMA_SPECIFIC_TOKENS_SOURCE = path.join(
    tokensDir,
    FILE_KEY_SPACING,
    '⛔️ Figma.Value.json',
  )

  const SPACING_PROPORTIONS_SQUARED_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '🪐 Space proportions.Squared.json',
  )

  const SEMANTIC_TOKENS_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '🗣️ Semantic.Mode 1.json',
  )

  const CONTAINER_SPACE_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '🪐 Container space.Default.json',
  )

  const PAGE_SPACE_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '🪐 Page space.Default.json',
  )

  // Explicitly include all token files needed to resolve semantic token references
  // Only default modes are included for variable collections (other modes built separately)
  const MODES_DIR = path.join(tokensDir, FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES)

  // Files without variable collection modes (include all)
  const BOX_FILES = [
    path.join(MODES_DIR, '📦 Box.Container.json'),
    path.join(MODES_DIR, '📦 Box.Generic.json'),
    path.join(MODES_DIR, '📦 Box.Page.json'),
    path.join(MODES_DIR, '📦 Box.Selectable.json'),
  ]

  const SPACE_FILES = [
    path.join(MODES_DIR, '🪐 Container space.Default.json'),
    path.join(MODES_DIR, '🪐 Page space.Default.json'),
    path.join(MODES_DIR, '🪐 Selectable space.XS.json'),
    path.join(MODES_DIR, '🪐 Selectable space.SM.json'),
    path.join(MODES_DIR, '🪐 Selectable space.MD.json'),
    path.join(MODES_DIR, '🪐 Selectable space.LG.json'),
    path.join(MODES_DIR, '🪐 Selectable space.XL.json'),
    path.join(MODES_DIR, '🪐 Space proportions.Squared.json'),
    path.join(MODES_DIR, '🪐 Space proportions.Squished.json'),
    path.join(MODES_DIR, '🪐 Space proportions.Stretched.json'),
  ]

  // Variable collections - only include default modes for most
  // For Font family: include all files so StyleDictionary can resolve {Font family.XS.*} references
  // (all Font family files define the same token paths, StyleDictionary needs to see at least one)
  const FONT_SIZE_DEFAULT = path.join(MODES_DIR, '🅰️ Font size.XS.json')
  const FONT_FAMILY_FILES = [
    path.join(MODES_DIR, '🅰️ Font family.Header.json'),
    path.join(MODES_DIR, '🅰️ Font family.UI and Body.json'),
    path.join(MODES_DIR, '🅰️ Font family.UI Body.json'),
  ]
  const FONT_WEIGHT_DEFAULT = path.join(MODES_DIR, '🅰️ Font weight.Normal.json')
  const FONT_BASELINE_DEFAULT = path.join(
    MODES_DIR,
    '🅰️ Font baseline.Centred.json',
  )
  const LETTER_SPACING_DEFAULT = path.join(
    MODES_DIR,
    '🅰️ Letter spacing.Normal.json',
  )
  const LINEHEIGHT_DEFAULT = path.join(MODES_DIR, '🅰️ Lineheight.Default.json')
  const STROKE_DEFAULT = path.join(MODES_DIR, '〰️ Stroke.Thin.json')
  const BORDER_RADIUS_DEFAULT = path.join(
    MODES_DIR,
    '⭕️ Border radius.Rounded.json',
  )
  const ICON_SIZE_DEFAULT = path.join(MODES_DIR, '🖼️ Icon size.XS.json')
  const SIZE_DEFAULT = path.join(MODES_DIR, '📐 Size.XS.json')
  const HORIZONTAL_GAP_DEFAULT = path.join(
    MODES_DIR,
    '🪐 Horizontal gap.XS.json',
  )
  const VERTICAL_GAP_DEFAULT = path.join(MODES_DIR, '🪐 Vertical gap.XS.json')
  const HORIZONTAL_SPACE_DEFAULT = path.join(
    MODES_DIR,
    '🪐 Horizontal space.XS.json',
  )
  const VERTICAL_SPACE_DEFAULT = path.join(
    MODES_DIR,
    '🪐 Vertical space.XS.json',
  )

  const proportionConfigs = ['Squished', 'Squared', 'Stretched'] as const

  const createProportionsDictionary = (proportion: string) => {
    const proportionLower = proportion.toLowerCase()
    const sourcePath = path.join(
      tokensDir,
      FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
      `🪐 Space proportions.${proportion}.json`,
    )

    // Squared is the default, so it gets both :root and [data-space-proportions="squared"] selectors
    const selector =
      proportion === 'Squared'
        ? ':root, [data-space-proportions="squared"]'
        : `[data-space-proportions="${proportionLower}"]`

    return new StyleDictionary({
      include: [
        SPACING_PRIMITIVE_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        HORIZONTAL_GAP_DEFAULT,
        VERTICAL_GAP_DEFAULT,
      ],
      source: [sourcePath, CONTAINER_SPACE_SOURCE, PAGE_SPACE_SOURCE],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, spacingBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) => {
                // Include proportion tokens (e.g., Spacing proportions.XS.Inline)
                if (includeTokenFilter(token, [proportion])) return true

                // Include Container.Spacing tokens
                if (
                  token.path &&
                  token.path[0] === 'Container' &&
                  token.path[1] === 'Spacing'
                ) {
                  return true
                }

                // Include Page.Spacing tokens
                if (
                  token.path &&
                  token.path[0] === 'Page' &&
                  token.path[1] === 'Spacing'
                ) {
                  return true
                }

                return false
              },
              destination: `space-proportions-${proportionLower}.css`,
              format: 'css/variables',
              options: {
                selector,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const proportionsDictionaries = proportionConfigs.map((proportion) =>
    createProportionsDictionary(proportion),
  )

  await Promise.all(
    proportionsDictionaries.map((dict) => dict.buildAllPlatforms()),
  )

  const sizeConfigs = ['XS', 'SM', 'MD', 'LG', 'XL'] as const

  const createSelectableSpaceDictionary = (size: string) => {
    const sizeLower = size.toLowerCase()
    const sourcePath = path.join(
      tokensDir,
      FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
      `🪐 Selectable space.${size}.json`,
    )

    // XS is the default, so it gets both :root and [data-selectable-space="xs"] selectors
    const selector =
      size === 'XS'
        ? ':root, [data-selectable-space="xs"]'
        : `[data-selectable-space="${sizeLower}"]`

    return new StyleDictionary({
      include: [
        SPACING_PRIMITIVE_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        SPACING_PROPORTIONS_SQUARED_SOURCE,
      ],
      source: [sourcePath],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, spacingBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) =>
                includeTokenFilter(token, [size]),
              destination: `selectable-space-${sizeLower}.css`,
              format: 'css/variables',
              options: {
                selector,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const selectableSpaceDictionaries = sizeConfigs.map((size) =>
    createSelectableSpaceDictionary(size),
  )

  await Promise.all(
    selectableSpaceDictionaries.map((dict) => dict.buildAllPlatforms()),
  )

  // Generate semantic gap variables directly from the semantic tokens file
  // Only default modes are included for variable collections (e.g., Font size.XS, Font family.UI Body)
  // Other modes are built separately and controlled via data-attributes
  // Reference chain: {font-size} → {Font family.XS.font-size} → {typography.ui-body.xs.font-size} → {type-scale.inter.200.font-size} → value
  // All dependency tokens are included in the include array to allow StyleDictionary to resolve references
  // Note: BOX_FILES are NOT included here because they define tokens at the root level (e.g., "Stroke")
  // which conflict with the semantic tokens file structure
  const semanticGapsDict = new StyleDictionary({
    include: [
      SPACING_PRIMITIVE_SOURCE, // type-scale.inter/equinor primitives
      FIGMA_SPECIFIC_TOKENS_SOURCE, // figma.type-scale values
      DENSITY_SPACIOUS_SOURCE, // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      DENSITY_COMFORTABLE_SOURCE, // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      STROKE_DEFAULT, // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      BORDER_RADIUS_DEFAULT,
      ICON_SIZE_DEFAULT,
      SIZE_DEFAULT,
      // Space tokens
      ...SPACE_FILES,
      // Typography tokens
      ...FONT_FAMILY_FILES, // Include all Font family files for reference resolution
      FONT_SIZE_DEFAULT,
      FONT_WEIGHT_DEFAULT,
      FONT_BASELINE_DEFAULT,
      LETTER_SPACING_DEFAULT,
      LINEHEIGHT_DEFAULT,
      // Gap and space tokens
      HORIZONTAL_GAP_DEFAULT,
      VERTICAL_GAP_DEFAULT,
      HORIZONTAL_SPACE_DEFAULT,
      VERTICAL_SPACE_DEFAULT,
    ],
    log: {
      verbosity: 'verbose',
    },
    source: [SEMANTIC_TOKENS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) => {
              if (!token.path) return false

              const component = token.path[0]
              const property = token.path[1]

              // Filter for gap tokens from the semantic tokens file
              // All components now use correct spelling "Horizontal gap" / "Vertical gap"
              const isSelectableGap =
                component === 'Selectable' &&
                (property === 'Horizontal gap' || property === 'Vertical gap')
              const isContainerGap =
                component === 'Container' &&
                (property === 'Horizontal gap' || property === 'Vertical gap')
              const isPageGap =
                component === 'Page' &&
                (property === 'Horizontal gap' || property === 'Vertical gap')
              const isGenericGap =
                component === 'Generic' &&
                (property === 'Horizontal gap' || property === 'Vertical gap')

              return (
                isSelectableGap || isContainerGap || isPageGap || isGenericGap
              )
            },
            destination: 'semantic-spacing-gaps.css',
            format: 'css/variables',
            options: {
              selector: ':root',
              outputReferences: true,
            },
          },
        ],
      },
    },
  })

  await semanticGapsDict.buildAllPlatforms()
}
