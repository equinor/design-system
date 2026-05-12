import path from 'path'
import os from 'os'
import fs from 'fs'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import {
  includeTokenFilter,
  typescriptNestedFormat,
} from '@equinor/eds-tokens-build'

export const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
export const FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES = 'FQQqyumcpPQoiFRCjdS9GM'

const PREFIX = 'eds'
const SPACING_BUILD_PATH = 'spacing/'
const TYPOGRAPHY_BUILD_PATH = 'typography/'

interface BaseOptions {
  source: string[]
  include?: string[]
  transforms: string[]
  prefix?: string
}

interface BuildTokenOptions extends BaseOptions {
  buildPath: string
  destination: string
  selector?: string
  filter: (token: TransformedToken) => boolean
  outputReferences?: boolean
  rootName?: string
  tsBuildPath?: string
  /**
   * Hyphenated prefixes that are split into nested keys when found at the
   * start of a token-path leaf. See `BuildNestedObjectOptions` in
   * `@equinor/eds-tokens-build`. Only affects the TS output.
   */
  splitLeafPrefixes?: readonly string[]
}

// TODO: To generate JS and JSON output for all spacing/typography tokens (not just density),
// add js and json platforms here, matching the pattern in buildDensityDictionary.
// Currently only buildDensityDictionary produces JS/JSON (for spacious/comfortable).
async function buildTokenDictionary({
  source,
  include = [],
  buildPath,
  destination,
  selector = ':root',
  prefix = PREFIX,
  transforms,
  filter,
  outputReferences = true,
  rootName,
  tsBuildPath,
  splitLeafPrefixes,
}: BuildTokenOptions) {
  const platforms: Record<string, unknown> = {
    css: {
      transformGroup: 'css',
      prefix,
      buildPath,
      transforms,
      files: [
        {
          filter,
          destination,
          format: 'css/variables',
          options: {
            selector,
            outputReferences,
          },
        },
      ],
    },
  }

  if (rootName && tsBuildPath) {
    const tsDestination = destination.replace(/\.css$/, '.ts')
    platforms.tsNested = {
      buildPath: tsBuildPath,
      files: [
        {
          filter,
          destination: tsDestination,
          format: 'typescript/nested',
          options: { rootName, splitLeafPrefixes },
        },
      ],
    }
  }

  const sd = new StyleDictionary({
    include,
    source,
    platforms,
    ...(rootName && {
      hooks: {
        formats: {
          'typescript/nested': typescriptNestedFormat,
        },
      },
    }),
  })
  await sd.buildAllPlatforms()
}

interface BuildDensityOptions extends BaseOptions {
  jsBuildPath: string
  jsonBuildPath: string
  cssBuildPath: string
  tsBuildPath?: string
  filter: (token: TransformedToken) => boolean
  name: string
  selector: string
  rootName?: string
}

async function buildDensityDictionary({
  source,
  include = [],
  jsBuildPath,
  jsonBuildPath,
  cssBuildPath,
  tsBuildPath,
  transforms,
  prefix = PREFIX,
  filter,
  name,
  selector,
  rootName,
}: BuildDensityOptions) {
  // Aggregated tokens should only appear in the nested TS output.
  // CSS, JS, and JSON have their own dedicated builds for these tokens.
  const nonAggregatedFilter = (token: TransformedToken): boolean =>
    filter(token) && !token.filePath.includes('eds-aggregated-spacing')

  const platforms: Record<string, unknown> = {
    ts: {
      transforms: ['name/constant'],
      buildPath: jsBuildPath,
      files: [
        {
          filter: nonAggregatedFilter,
          destination: `spacing/${name}.js`,
          format: 'javascript/es6',
        },
        {
          filter: nonAggregatedFilter,
          format: 'typescript/es6-declarations',
          destination: `spacing/${name}.d.ts`,
        },
      ],
    },
    json: {
      buildPath: jsonBuildPath,
      transforms: ['name/kebab'],
      files: [
        {
          filter: nonAggregatedFilter,
          destination: `spacing/flat/${name}.json`,
          format: 'json/flat',
        },
        {
          filter: nonAggregatedFilter,
          destination: `spacing/nested/${name}.json`,
          format: 'json/nested',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      prefix,
      buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
      transforms,
      files: [
        {
          filter: nonAggregatedFilter,
          destination: `${name}.css`,
          format: 'css/variables',
          options: {
            selector,
            outputReferences: false,
          },
        },
      ],
    },
  }

  if (rootName && tsBuildPath) {
    platforms.tsNested = {
      buildPath: tsBuildPath,
      files: [
        {
          filter,
          destination: `${name}.ts`,
          format: 'typescript/nested',
          options: { rootName },
        },
      ],
    }
  }

  const sd = new StyleDictionary({
    include,
    source,
    platforms,
    ...(rootName && {
      hooks: {
        formats: {
          'typescript/nested': typescriptNestedFormat,
        },
      },
    }),
  })
  await sd.buildAllPlatforms()
}

/**
 * Build an aggregated JSON token object combining all derived spacing tokens
 * nested by their Figma mode name, using DTCG references to density tokens.
 * When fed as additional source to density builds, Style Dictionary resolves
 * all references against the density values, producing comprehensive TS output.
 */
function createAggregatedSpacingJson() {
  const sizes = [
    'none',
    '4xs',
    '3xs',
    '2xs',
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
    '3xl',
  ] as const
  const insetSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
  const proportionTypes = ['squished', 'squared', 'stretched'] as const

  const numToken = (value: string | number) => ({
    $type: 'number',
    $value: value,
  })

  // generic-gap and generic-space: nested as generic.gap.{size}.{horizontal,vertical}
  const buildGenericScale = () =>
    Object.fromEntries(
      sizes.map((s) => [
        s,
        {
          horizontal: numToken(s === 'none' ? 0 : `{spacing.horizontal.${s}}`),
          vertical: numToken(s === 'none' ? 0 : `{spacing.vertical.${s}}`),
        },
      ]),
    )

  // spacing-proportions nested by proportion type
  const buildProportions = () =>
    Object.fromEntries(
      proportionTypes.map((pt) => [
        pt,
        Object.fromEntries(
          insetSizes.map((s) => [
            s,
            {
              horizontal: numToken(`{spacing.inset.${s}.horizontal}`),
              vertical: numToken(`{spacing.inset.${s}.vertical-${pt}}`),
            },
          ]),
        ),
      ]),
    )

  // selectable-space nested by size (defaults to squared proportions)
  const buildSelectableSpace = () =>
    Object.fromEntries(
      insetSizes.map((s) => [
        s,
        {
          horizontal: numToken(`{spacing.inset.${s}.horizontal}`),
          vertical: numToken(`{spacing.inset.${s}.vertical-squared}`),
        },
      ]),
    )

  return {
    generic: {
      gap: buildGenericScale(),
      space: buildGenericScale(),
    },
    'spacing-proportions': buildProportions(),
    'selectable-space': buildSelectableSpace(),
    'container-space': {
      horizontal: numToken('{spacing.inset.md.horizontal}'),
      vertical: numToken('{spacing.inset.md.vertical-squared}'),
    },
    'page-space': {
      horizontal: numToken('{spacing.inset.xl.horizontal}'),
      vertical: numToken('{spacing.inset.xl.vertical-squared}'),
    },
  }
}

export async function createSpacingAndTypographyVariables({
  tokensDir,
  cssBuildPath,
  cssTransforms,
}: {
  tokensDir: string
  cssBuildPath: string
  cssTransforms: string[]
}) {
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
  const spacingTsBuildPath = path.join(
    outputDirectory,
    'ts',
    SPACING_BUILD_PATH,
  )
  const tsBuildPath = path.join(outputDirectory, 'ts', TYPOGRAPHY_BUILD_PATH)

  // Clean up old individual TS files that are no longer generated
  const existingTsFiles: string[] = await fs.promises
    .readdir(spacingTsBuildPath)
    .catch((): string[] => [])
  for (const file of existingTsFiles) {
    if (
      file.endsWith('.ts') &&
      file !== 'spacious.ts' &&
      file !== 'comfortable.ts' &&
      file !== 'index.ts'
    ) {
      await fs.promises.unlink(path.join(spacingTsBuildPath, file))
    }
  }

  // Clean up stale typography TS files. Only font-family-* is emitted today;
  // font-size-*, font-weight-*, line-height-*, tracking-*, and the older
  // size-extras.ts all used to be emitted but were removed. Style Dictionary
  // collapses non-family axes to a single arbitrary cell of the family
  // matrix, and the family-independent size extras (icon-size etc.) are now
  // spliced directly into each size cell of the font-family files.
  const existingTypographyTsFiles: string[] = await fs.promises
    .readdir(tsBuildPath)
    .catch((): string[] => [])
  const KEPT_TYPOGRAPHY_TS = (file: string) => file.startsWith('font-family-')
  for (const file of existingTypographyTsFiles) {
    if (
      file.endsWith('.ts') &&
      file !== 'index.ts' &&
      !KEPT_TYPOGRAPHY_TS(file)
    ) {
      await fs.promises.unlink(path.join(tsBuildPath, file))
    }
  }

  // Write aggregated spacing JSON for derived tokens
  const aggregatedJson = createAggregatedSpacingJson()
  const aggregatedPath = path.join(os.tmpdir(), 'eds-aggregated-spacing.json')
  await fs.promises.writeFile(
    aggregatedPath,
    JSON.stringify(aggregatedJson, null, 2),
  )

  // Exclusions for density filters — same as includeTokenFilter defaults
  // minus 'container' (which would block container-space tokens)
  const DENSITY_EXCLUSIONS = [
    'documentation',
    'padding-centred',
    'padding-baselined',
    'cap-height',
    'cap-rounded',
  ]

  const createDensityFilter =
    (densitySegment: string) =>
    (token: TransformedToken): boolean => {
      const name = token.name.toLowerCase()
      if (DENSITY_EXCLUSIONS.some((ex) => name.includes(ex))) return false
      // Exclude icon container sizing (e.g. sizing-icon-xs-container) but NOT container-space
      if (name.includes('-container') && !name.startsWith('container-space'))
        return false
      // Include tokens from density file OR aggregated file
      return (
        token.filePath.includes(densitySegment) ||
        token.filePath.includes('eds-aggregated-spacing')
      )
    }

  const densitySpaciousFilter = createDensityFilter('Spacious')
  const densityComfortableFilter = createDensityFilter('Comfortable')

  await buildDensityDictionary({
    source: [DENSITY_SPACIOUS_SOURCE, aggregatedPath],
    include: [PRIMITIVES_SOURCE, DENSITY_FIGMA_SOURCE],
    jsBuildPath,
    jsonBuildPath,
    cssBuildPath,
    transforms: cssTransforms,
    filter: densitySpaciousFilter,
    name: 'spacious',
    selector: ':root, [data-density="spacious"]',
    rootName: 'spacing',
    tsBuildPath: spacingTsBuildPath,
  })

  await buildDensityDictionary({
    source: [DENSITY_COMFORTABLE_SOURCE, aggregatedPath],
    include: [PRIMITIVES_SOURCE, DENSITY_FIGMA_SOURCE],
    jsBuildPath,
    jsonBuildPath,
    cssBuildPath,
    transforms: cssTransforms,
    filter: densityComfortableFilter,
    name: 'comfortable',
    selector: '[data-density="comfortable"]',
    rootName: 'spacing',
    tsBuildPath: spacingTsBuildPath,
  })

  // Clean up temp file
  await fs.promises.unlink(aggregatedPath)

  // Write index.ts re-exporting both density files
  const indexContent = [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    "export { spacing as spacious } from './spacious'",
    "export { spacing as comfortable } from './comfortable'",
    '',
  ].join('\n')
  await fs.promises.writeFile(
    path.join(spacingTsBuildPath, 'index.ts'),
    indexContent,
  )

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

  await Promise.all(
    proportionConfigs.map((proportion) => {
      const proportionLower = proportion.toLowerCase()
      const sourcePath = path.join(
        tokensDir,
        FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
        `🪐 Space proportions.${proportion}.json`,
      )

      const selector =
        proportion === 'Squared'
          ? ':root, [data-space-proportions="squared"]'
          : `[data-space-proportions="${proportionLower}"]`

      return buildTokenDictionary({
        include: [
          PRIMITIVES_SOURCE,
          FIGMA_SPECIFIC_TOKENS_SOURCE,
          DENSITY_SPACIOUS_SOURCE,
          HORIZONTAL_GAP_DEFAULT,
          VERTICAL_GAP_DEFAULT,
        ],
        source: [sourcePath, CONTAINER_SPACE_SOURCE, PAGE_SPACE_SOURCE],
        buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
        transforms: cssTransforms,
        destination: `space-proportions-${proportionLower}.css`,
        selector,
        filter: (token: TransformedToken) => {
          if (includeTokenFilter(token, [proportion])) return true
          if (
            token.path &&
            token.path[0] === 'Container' &&
            token.path[1] === 'Spacing'
          ) {
            return true
          }
          if (
            token.path &&
            token.path[0] === 'Page' &&
            token.path[1] === 'Spacing'
          ) {
            return true
          }
          return false
        },
      })
    }),
  )

  const sizeConfigs = ['XS', 'SM', 'MD', 'LG', 'XL'] as const

  await Promise.all(
    sizeConfigs.map((size) => {
      const sizeLower = size.toLowerCase()
      const sourcePath = path.join(
        tokensDir,
        FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
        `🪐 Selectable space.${size}.json`,
      )

      const selector =
        size === 'XS'
          ? ':root, [data-selectable-space="xs"]'
          : `[data-selectable-space="${sizeLower}"]`

      return buildTokenDictionary({
        include: [
          PRIMITIVES_SOURCE,
          FIGMA_SPECIFIC_TOKENS_SOURCE,
          DENSITY_SPACIOUS_SOURCE,
          SPACING_PROPORTIONS_SQUARED_SOURCE,
        ],
        source: [sourcePath],
        buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
        transforms: cssTransforms,
        destination: `selectable-space-${sizeLower}.css`,
        selector,
        filter: (token: TransformedToken) => includeTokenFilter(token, [size]),
      })
    }),
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

  const createGenericSpacingDictionary = async (
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

    const include = [
      PRIMITIVES_SOURCE,
      FIGMA_SPECIFIC_TOKENS_SOURCE,
      DENSITY_SPACIOUS_SOURCE,
    ]

    await buildTokenDictionary({
      include,
      source: [horizontalPath],
      buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
      transforms: cssTransforms,
      destination: `generic-${type}-horizontal-${sizeLower}.css`,
      selector: horizontalSelector,
      filter: (token: TransformedToken) =>
        !!(token.path && token.path[0] === `generic-${type}-horizontal`),
    })

    await buildTokenDictionary({
      include,
      source: [verticalPath],
      buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
      transforms: cssTransforms,
      destination: `generic-${type}-vertical-${sizeLower}.css`,
      selector: verticalSelector,
      filter: (token: TransformedToken) =>
        !!(token.path && token.path[0] === `generic-${type}-vertical`),
    })
  }

  await Promise.all(
    genericSizeConfigs.flatMap((size) => [
      createGenericSpacingDictionary('gap', size),
      createGenericSpacingDictionary('space', size),
    ]),
  )

  // Generate container space variables

  const commonInclude = [
    PRIMITIVES_SOURCE,
    FIGMA_SPECIFIC_TOKENS_SOURCE,
    DENSITY_SPACIOUS_SOURCE,
    SPACING_PROPORTIONS_SQUARED_SOURCE,
  ]

  // We include [data-space-proportions] in the selector to ensure semantic variables
  // are reset when a new proportion context is created. This overrides any specific
  // values inherited from parent elements, forcing the container/page space to
  // re-bind to the new proportion logic.
  await buildTokenDictionary({
    include: commonInclude,
    source: [CONTAINER_SPACE_SOURCE],
    buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
    transforms: cssTransforms,
    destination: 'container-space.css',
    selector: ':root, [data-space-proportions]',
    filter: (token: TransformedToken) =>
      !!(token.path && token.path[0] === 'container-space'),
  })

  await buildTokenDictionary({
    include: commonInclude,
    source: [PAGE_SPACE_SOURCE],
    buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
    transforms: cssTransforms,
    destination: 'page-space.css',
    selector: ':root, [data-space-proportions]',
    filter: (token: TransformedToken) =>
      !!(token.path && token.path[0] === 'page-space'),
  })

  // Generate semantic space and gap variables directly from the semantic tokens file
  // Only default modes are included for variable collections (e.g., Font size.XS, Font family.UI Body)
  // Other modes are built separately and controlled via data-attributes
  // Reference chain: {font-size} → {Font family.XS.font-size} → {typography.ui-body.xs.font-size} → {type-scale.inter.200.font-size} → value
  // All dependency tokens are included in the include array to allow StyleDictionary to resolve references
  // Note: BOX_FILES are NOT included here because they define tokens at the root level (e.g., "Stroke")
  // which conflict with the semantic tokens file structure
  await buildTokenDictionary({
    include: [
      PRIMITIVES_SOURCE,
      FIGMA_SPECIFIC_TOKENS_SOURCE,
      DENSITY_SPACIOUS_SOURCE,
      DENSITY_COMFORTABLE_SOURCE,
      STROKE_DEFAULT,
      BORDER_RADIUS_DEFAULT,
      ICON_SIZE_DEFAULT,
      SIZE_DEFAULT,
      ...SPACE_FILES,
      ...FONT_FAMILY_FILES,
      FONT_SIZE_DEFAULT,
      FONT_WEIGHT_DEFAULT,
      FONT_BASELINE_DEFAULT,
      TRACKING_DEFAULT,
      LINE_HEIGHT_DEFAULT,
      HORIZONTAL_GAP_DEFAULT,
      VERTICAL_GAP_DEFAULT,
      HORIZONTAL_SPACE_DEFAULT,
      VERTICAL_SPACE_DEFAULT,
    ],
    source: [SEMANTIC_TOKENS_SOURCE],
    buildPath: path.join(cssBuildPath, SPACING_BUILD_PATH),
    transforms: cssTransforms,
    destination: 'semantic-spacing-gap.css',
    filter: (token: TransformedToken) => {
      if (!token.path) return false

      const component = token.path[0]
      const property = token.path[1]

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
  })

  // =============================
  // Typography Variable Generation
  // =============================

  const fontFamilyConfig = [
    { mode: 'Header', slug: 'header' },
    { mode: 'UI Body', slug: 'ui' },
  ] as const

  const fontSizeConfig = [
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

  const fontWeightConfig = [
    { mode: 'Lighter', slug: 'lighter' },
    { mode: 'Normal', slug: 'normal' },
    { mode: 'Bolder', slug: 'bolder' },
  ] as const

  const lineHeightConfig = [
    { mode: 'Default', slug: 'default' },
    { mode: 'Squished', slug: 'squished' },
  ] as const

  const trackingConfig = [
    { mode: 'Tight', slug: 'tight' },
    { mode: 'Normal', slug: 'normal' },
    { mode: 'Wide', slug: 'wide' },
    { mode: 'Loose', slug: 'loose' },
  ] as const

  const fontFamilyPromises = fontFamilyConfig.map(({ mode, slug }) =>
    buildTokenDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
      ],
      source: [path.join(MODES_DIR, `🅰️ Font family.${mode}.json`)],
      buildPath: path.join(cssBuildPath, TYPOGRAPHY_BUILD_PATH),
      transforms: cssTransforms,
      destination: `font-family-${slug}.css`,
      selector: `[data-font-family="${slug}"]`,
      filter: (token: TransformedToken) => includeTokenFilter(token, [mode]),
      rootName: 'typography',
      tsBuildPath,
      // Source JSON encodes axis variants as hyphenated leaf keys
      // (font-weight-lighter, tracking-tight, line-height-default). Splitting
      // them produces nested TS output (fontWeight.lighter etc.) so consumers
      // can derive variant types directly via `keyof`. CSS output is
      // unaffected — its format uses the unsplit path for variable naming.
      splitLeafPrefixes: ['font-weight', 'tracking', 'line-height'],
    }),
  )

  // Font-size builds emit CSS plus a temporary per-size TS file. The TS is
  // consumed by the post-step below to extract the three family-independent
  // values (icon-size, gap-horizontal, gap-vertical) which then get spliced
  // into each size cell of the family TS files. The temporary per-size files
  // are deleted before this build finishes.
  const fontSizePromises = fontSizeConfig.map((size) =>
    buildTokenDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        ...FONT_FAMILY_FILES,
      ],
      source: [path.join(MODES_DIR, `🅰️ Font size.${size}.json`)],
      buildPath: path.join(cssBuildPath, TYPOGRAPHY_BUILD_PATH),
      transforms: cssTransforms,
      destination: `font-size-${size.toLowerCase()}.css`,
      selector: `[data-font-size="${size.toLowerCase()}"]`,
      filter: (token) => includeTokenFilter(token, ['Font size', size]),
      rootName: 'typography',
      tsBuildPath,
    }),
  )

  // Font-weight, line-height, and tracking axes do NOT emit TS output. In
  // CSS these axis files work as runtime selectors via the data-* cascade
  // (e.g. [data-tracking="wide"] picks --tracking-wide from the active size).
  // Style Dictionary cannot represent runtime mode switching, so a static TS
  // export for one of these axes can only contain a single arbitrary cell
  // from the family matrix — silently wrong for every other combination.
  // Non-CSS consumers should import the family file directly and read the
  // nested axis values off the size cell (e.g.
  // `typography.fontFamilySize.md.fontWeight.bolder`).
  const fontWeightPromises = fontWeightConfig.map(({ mode, slug }) =>
    buildTokenDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        FONT_FAMILY_DEFAULT,
        FONT_SIZE_DEFAULT,
      ],
      source: [path.join(MODES_DIR, `🅰️ Font weight.${mode}.json`)],
      buildPath: path.join(cssBuildPath, TYPOGRAPHY_BUILD_PATH),
      transforms: cssTransforms,
      destination: `font-weight-${slug}.css`,
      selector: `[data-font-weight="${slug}"]`,
      filter: (token: TransformedToken) =>
        !!(token.path && token.path[1] === 'font-weight'),
    }),
  )

  const lineHeightPromises = lineHeightConfig.map(({ mode, slug }) =>
    buildTokenDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        FONT_FAMILY_DEFAULT,
        FONT_SIZE_DEFAULT,
      ],
      source: [path.join(MODES_DIR, `🅰️ Line height.${mode}.json`)],
      buildPath: path.join(cssBuildPath, TYPOGRAPHY_BUILD_PATH),
      transforms: cssTransforms,
      destination: `line-height-${slug}.css`,
      selector: `[data-line-height="${slug}"]`,
      filter: (token: TransformedToken) =>
        !!(token.path && token.path[1] === 'line-height'),
    }),
  )

  const trackingPromises = trackingConfig.map(({ mode, slug }) =>
    buildTokenDictionary({
      include: [
        PRIMITIVES_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
        FONT_FAMILY_DEFAULT,
        FONT_SIZE_DEFAULT,
      ],
      source: [path.join(MODES_DIR, `🅰️ Tracking.${mode}.json`)],
      buildPath: path.join(cssBuildPath, TYPOGRAPHY_BUILD_PATH),
      transforms: cssTransforms,
      destination: `tracking-${slug}.css`,
      selector: `[data-tracking="${slug}"]`,
      filter: (token: TransformedToken) =>
        !!(token.path && token.path[1] === 'tracking'),
    }),
  )

  await Promise.all([
    ...fontFamilyPromises,
    ...fontSizePromises,
    ...fontWeightPromises,
    ...lineHeightPromises,
    ...trackingPromises,
  ])

  // Splice the family-independent size-axis extras (icon-size, gap-horizontal,
  // gap-vertical) into each size cell of the font-family TS files. Style
  // Dictionary cannot ergonomically aggregate values across sources, but the
  // per-size CSS builds also emit a temporary TS file with already-resolved
  // numeric values for those three properties. We parse those files, inject
  // the values into the matching size cell of each family file, then delete
  // the temp files.
  //
  // This is a build-time string-injection over content this same script just
  // emitted, so the structure is predictable. The injection throws if a size
  // cell can't be located, so failures are loud.
  const sizeExtras: Record<
    string,
    { iconSize: number; gapHorizontal: number; gapVertical: number }
  > = {}

  const numberFor = (text: string, key: string): number => {
    const m = new RegExp(`${key}:\\s*(-?[\\d.]+)`).exec(text)
    if (!m) {
      throw new Error(`size-extras: ${key} not found while parsing per-size TS`)
    }
    return parseFloat(m[1])
  }

  for (const size of fontSizeConfig) {
    const sizeKey = size.toLowerCase()
    const tsPath = path.join(tsBuildPath, `font-size-${sizeKey}.ts`)
    const text = await fs.promises.readFile(tsPath, 'utf-8')
    sizeExtras[sizeKey] = {
      iconSize: numberFor(text, 'iconSize'),
      gapHorizontal: numberFor(text, 'gapHorizontal'),
      gapVertical: numberFor(text, 'gapVertical'),
    }
  }

  // Mapping from JSON size key (lowercase) to the camelCased identifier the
  // nested TS format emits. Mirrors `toCamelCase` in `typescriptNested.ts`.
  const sizeKeyToCamel: Record<string, string> = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': 'twoXl',
    '3xl': 'threeXl',
    '4xl': 'fourXl',
    '5xl': 'fiveXl',
    '6xl': 'sixXl',
  }

  for (const familySlug of ['ui', 'header'] as const) {
    const filePath = path.join(tsBuildPath, `font-family-${familySlug}.ts`)
    let content = await fs.promises.readFile(filePath, 'utf-8')
    for (const size of fontSizeConfig) {
      const sizeKey = size.toLowerCase()
      const camelKey = sizeKeyToCamel[sizeKey]
      const extras = sizeExtras[sizeKey]
      const injection =
        `      iconSize: ${extras.iconSize},\n` +
        `      gapHorizontal: ${extras.gapHorizontal},\n` +
        `      gapVertical: ${extras.gapVertical},\n`
      // Match the size cell's opening line (4-space indent at line start) and
      // its closing `},` (also 4-space indent at line start). Nested axis
      // blocks close at 6-space indent, so the line-anchored 4-space close is
      // unambiguous. Insert the extras before the closing `},`.
      const pattern = new RegExp(
        `(^    ${camelKey}: \\{\\n[\\s\\S]*?)(^    \\},)`,
        'm',
      )
      const next = content.replace(pattern, `$1${injection}$2`)
      if (next === content) {
        throw new Error(
          `size-extras inject: size cell "${camelKey}" not found in ${filePath}`,
        )
      }
      content = next
    }
    await fs.promises.writeFile(filePath, content, 'utf-8')
  }

  // Delete the temporary per-size TS files. The cleanup pass at the top of
  // this function would also remove them on next run, but doing it here
  // means a single build leaves the directory in its final state.
  for (const size of fontSizeConfig) {
    const sizeKey = size.toLowerCase()
    await fs.promises
      .unlink(path.join(tsBuildPath, `font-size-${sizeKey}.ts`))
      .catch(() => {})
  }
}
