import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import { includeTokenFilter } from '@equinor/eds-tokens-build'

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

  const PRIMITIVES_SOURCE = path.join(
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

  const outputDirectory = path.resolve(process.cwd(), 'build')
  const jsBuildPath = path.join(outputDirectory, 'js')
  const jsonBuildPath = path.join(outputDirectory, 'json')

  const densitySpaciousFilter = (token: TransformedToken) =>
    includeTokenFilter(token, ['Density', 'Spacious'])
  const densityComfortableFilter = (token: TransformedToken) =>
    includeTokenFilter(token, ['Density', 'Comfortable'])

  const spacious = new StyleDictionary({
    include: [PRIMITIVES_SOURCE, DENSITY_FIGMA_SOURCE],
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
    include: [PRIMITIVES_SOURCE, DENSITY_FIGMA_SOURCE],
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
  const FONT_FAMILY_DEFAULT = path.join(
    MODES_DIR,
    '🅰️ Font family.UI Body.json',
  )
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
  const TRACKING_DEFAULT = path.join(MODES_DIR, '🅰️ Tracking.Normal.json')
  const LINE_HEIGHT_DEFAULT = path.join(
    MODES_DIR,
    '🅰️ Line height.Default.json',
  )
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
        PRIMITIVES_SOURCE,
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
        PRIMITIVES_SOURCE,
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

  const genericSizeConfigs = [
    'None',
    '4XS',
    '3XS',
    '2XS',
    'XS',
    'SM',
    'MD',
    'LG',
    'XL',
    '2XL',
    '3XL',
  ] as const

  const createGenericSpacingDictionary = (
    type: 'gap' | 'space',
    size: string,
  ) => {
    const sizeLower = size.toLowerCase()
    const horizontalPath = path.join(
      tokensDir,
      FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
      `🪐 Horizontal ${type}.${size}.json`,
    )
    const verticalPath = path.join(
      tokensDir,
      FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
      `🪐 Vertical ${type}.${size}.json`,
    )

    // XS is the default, so it gets both :root and size-specific selectors
    const horizontalSelector =
      size === 'XS'
        ? `:root, [data-horizontal-${type}="xs"]`
        : `[data-horizontal-${type}="${sizeLower}"]`

    const verticalSelector =
      size === 'XS'
        ? `:root, [data-vertical-${type}="xs"]`
        : `[data-vertical-${type}="${sizeLower}"]`

    return new StyleDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
      ],
      source: [horizontalPath, verticalPath],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, spacingBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) =>
                token.path && token.path[0] === `generic-${type}-horizontal`,
              destination: `generic-${type}-horizontal-${sizeLower}.css`,
              format: 'css/variables',
              options: {
                selector: horizontalSelector,
                outputReferences: true,
              },
            },
            {
              filter: (token: TransformedToken) =>
                token.path && token.path[0] === `generic-${type}-vertical`,
              destination: `generic-${type}-vertical-${sizeLower}.css`,
              format: 'css/variables',
              options: {
                selector: verticalSelector,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const genericGapDictionaries = genericSizeConfigs.map((size) =>
    createGenericSpacingDictionary('gap', size),
  )

  const genericSpaceDictionaries = genericSizeConfigs.map((size) =>
    createGenericSpacingDictionary('space', size),
  )

  await Promise.all([
    ...genericGapDictionaries.map((dict) => dict.buildAllPlatforms()),
    ...genericSpaceDictionaries.map((dict) => dict.buildAllPlatforms()),
  ])

  // Generate container space variables
  const spaceProportionSelectors = proportionConfigs.map(
    (proportion) => `[data-space-proportions="${proportion.toLowerCase()}"]`,
  )

  const containerAndPageSelector = [':root', ...spaceProportionSelectors].join(
    ', ',
  )

  const containerSpaceDict = new StyleDictionary({
    include: [
      PRIMITIVES_SOURCE,
      FIGMA_SPECIFIC_TOKENS_SOURCE,
      DENSITY_SPACIOUS_SOURCE,
      SPACING_PROPORTIONS_SQUARED_SOURCE,
    ],
    source: [CONTAINER_SPACE_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) =>
              token.path && token.path[0] === 'container-space',
            destination: 'container-space.css',
            format: 'css/variables',
            options: {
              selector: containerAndPageSelector,
              outputReferences: true,
            },
          },
        ],
      },
    },
  })

  // Generate page space variables
  const pageSpaceDict = new StyleDictionary({
    include: [
      PRIMITIVES_SOURCE,
      FIGMA_SPECIFIC_TOKENS_SOURCE,
      DENSITY_SPACIOUS_SOURCE,
      SPACING_PROPORTIONS_SQUARED_SOURCE,
    ],
    source: [PAGE_SPACE_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) =>
              token.path && token.path[0] === 'page-space',
            destination: 'page-space.css',
            format: 'css/variables',
            options: {
              selector: containerAndPageSelector,
              outputReferences: true,
            },
          },
        ],
      },
    },
  })

  await Promise.all([
    containerSpaceDict.buildAllPlatforms(),
    pageSpaceDict.buildAllPlatforms(),
  ])

  // Generate semantic space and gap variables directly from the semantic tokens file
  // Only default modes are included for variable collections (e.g., Font size.XS, Font family.UI Body)
  // Other modes are built separately and controlled via data-attributes
  // Reference chain: {font-size} → {Font family.XS.font-size} → {typography.ui-body.xs.font-size} → {type-scale.inter.200.font-size} → value
  // All dependency tokens are included in the include array to allow StyleDictionary to resolve references
  // Note: BOX_FILES are NOT included here because they define tokens at the root level (e.g., "Stroke")
  // which conflict with the semantic tokens file structure
  const semanticGapDict = new StyleDictionary({
    include: [
      PRIMITIVES_SOURCE, // type-scale.inter/equinor primitives
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
      TRACKING_DEFAULT,
      LINE_HEIGHT_DEFAULT,
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

              // Filter for gap and space tokens from the semantic tokens file
              // Token names follow pattern: "Gap horizontal" / "Gap vertical" / "Space horizontal" / "Space vertical" (noun first, then direction)
              const isSelectableGap =
                component === 'Selectable' &&
                (property === 'Gap horizontal' || property === 'Gap vertical')
              const isContainerGap =
                component === 'Container' &&
                (property === 'Gap horizontal' || property === 'Gap vertical')
              const isPageGap =
                component === 'Page' &&
                (property === 'Gap horizontal' || property === 'Gap vertical')

              return isSelectableGap || isContainerGap || isPageGap
            },
            destination: 'semantic-spacing-gap.css',
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

  await semanticGapDict.buildAllPlatforms()

  // =============================
  // Typography Variable Generation
  // =============================

  const typographyBuildPath = 'typography/'

  // Font Family configurations
  const fontFamilyConfigs = [
    { mode: 'Header', slug: 'header' },
    { mode: 'UI Body', slug: 'ui' },
  ] as const

  // Font Size configurations
  const fontSizeConfigs = [
    'XS',
    'SM',
    'MD',
    'LG',
    'XL',
    '2XL',
    '3XL',
    '4XL',
    '5XL',
    '6XL',
  ] as const

  // Font Weight configurations
  const fontWeightConfigs = [
    { mode: 'Lighter', slug: 'lighter' },
    { mode: 'Normal', slug: 'normal' },
    { mode: 'Bolder', slug: 'bolder' },
  ] as const

  // Line Height configurations
  const lineHeightConfigs = [
    { mode: 'Default', slug: 'default' },
    { mode: 'Squished', slug: 'squished' },
  ] as const

  // Tracking configurations
  const trackingConfig = [
    { mode: 'Tight', slug: 'tight' },
    { mode: 'Normal', slug: 'normal' },
    { mode: 'Wide', slug: 'wide' },
    { mode: 'Loose', slug: 'loose' },
  ] as const

  // Generate Font Family CSS files
  const createFontFamilyDictionary = (familyConfig: {
    mode: string
    slug: string
  }) => {
    const { mode, slug } = familyConfig
    const sourcePath = path.join(MODES_DIR, `🅰️ Font family.${mode}.json`)

    return new StyleDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
      ],
      source: [sourcePath],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, typographyBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) =>
                includeTokenFilter(token, [mode]),
              destination: `font-family-${slug}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-font-family="${slug}"]`,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const fontFamilyDictionaries = fontFamilyConfigs.map((config) =>
    createFontFamilyDictionary(config),
  )
  await Promise.all(
    fontFamilyDictionaries.map((dict) => dict.buildAllPlatforms()),
  )

  // Generate Font Size CSS files
  const createFontSizeDictionary = (size: string) => {
    const sourcePath = path.join(MODES_DIR, `🅰️ Font size.${size}.json`)
    const sizeSlug = size.toLowerCase()

    return new StyleDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        ...FONT_FAMILY_FILES,
      ],
      source: [sourcePath],
      log: {
        verbosity: 'verbose',
      },
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, typographyBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token) => includeTokenFilter(token, ['Font size', size]),
              destination: `font-size-${sizeSlug}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-font-size="${sizeSlug}"]`,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const fontSizeDictionaries = fontSizeConfigs.map((size) =>
    createFontSizeDictionary(size),
  )
  await Promise.all(
    fontSizeDictionaries.map((dict) => dict.buildAllPlatforms()),
  )

  // Generate Font Weight CSS files
  const createFontWeightDictionary = (weightConfig: {
    mode: string
    slug: string
  }) => {
    const { mode, slug } = weightConfig
    const sourcePath = path.join(MODES_DIR, `🅰️ Font weight.${mode}.json`)

    return new StyleDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        FONT_FAMILY_DEFAULT,
        FONT_SIZE_DEFAULT,
      ],
      source: [sourcePath],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, typographyBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) =>
                token.path && token.path[1] === 'font-weight',
              destination: `font-weight-${slug}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-font-weight="${slug}"]`,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const fontWeightDictionaries = fontWeightConfigs.map((config) =>
    createFontWeightDictionary(config),
  )
  await Promise.all(
    fontWeightDictionaries.map((dict) => dict.buildAllPlatforms()),
  )

  // Generate Line Height CSS files
  const createLineHeightDictionary = (heightConfig: {
    mode: string
    slug: string
  }) => {
    const { mode, slug } = heightConfig
    const sourcePath = path.join(MODES_DIR, `🅰️ Line height.${mode}.json`)

    return new StyleDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        FONT_FAMILY_DEFAULT,
        FONT_SIZE_DEFAULT,
      ],
      source: [sourcePath],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, typographyBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) =>
                token.path && token.path[1] === 'line-height',
              destination: `line-height-${slug}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-line-height="${slug}"]`,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const lineHeightDictionaries = lineHeightConfigs.map((config) =>
    createLineHeightDictionary(config),
  )
  await Promise.all(
    lineHeightDictionaries.map((dict) => dict.buildAllPlatforms()),
  )

  // Generate Tracking CSS files
  const createTrackingDictionary = (spacingConfig: {
    mode: string
    slug: string
  }) => {
    const { mode, slug } = spacingConfig
    const sourcePath = path.join(MODES_DIR, `🅰️ Tracking.${mode}.json`)

    return new StyleDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        FONT_FAMILY_DEFAULT,
        FONT_SIZE_DEFAULT,
      ],
      source: [sourcePath],
      platforms: {
        css: {
          transformGroup: 'css',
          prefix,
          buildPath: path.join(cssBuildPath, typographyBuildPath),
          transforms: cssTransforms,
          files: [
            {
              filter: (token: TransformedToken) =>
                token.path && token.path[1] === 'tracking',
              destination: `tracking-${slug}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-tracking="${slug}"]`,
                outputReferences: true,
              },
            },
          ],
        },
      },
    })
  }

  const trackingDictionaries = trackingConfig.map((config) =>
    createTrackingDictionary(config),
  )
  await Promise.all(
    trackingDictionaries.map((dict) => dict.buildAllPlatforms()),
  )
}
