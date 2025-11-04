import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import { outputReferencesTransformed } from 'style-dictionary/utils'
import {
  _extend,
  includeTokenFilter,
  createDensitySpaceToggleTransform,
  FONT_QUOTE_NAME,
  PX_FORMATTED_NAME,
  PX_TO_REM_NAME,
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
  const outputReferences = true

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

  const spacingPrimitives = _extend({
    source: [SPACING_PRIMITIVE_SOURCE],
    buildPath: spacingBuildPath,
    prefix,
    fileName: 'primitives',
    filter: (token) => includeTokenFilter(token),
    transforms: cssTransforms,
  })

  const densityComfortable = _extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_COMFORTABLE_SOURCE],
    buildPath: spacingBuildPath,
    prefix,
    fileName: 'comfortable',
    selector: '[data-density="comfortable"]',
    filter: (token) => includeTokenFilter(token, ['Density']),
    outputReferences,
    transforms: cssTransforms,
  })

  const densitySpacious = _extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    buildPath: spacingBuildPath,
    prefix,
    fileName: 'spacious',
    selector: ':root, [data-density="spacious"]',
    filter: (token) => includeTokenFilter(token, ['Density']),
    outputReferences,
    transforms: cssTransforms,
  })

  const densityAllTrimmed = new StyleDictionary({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: [
          'name/kebab',
          PX_TO_REM_NAME,
          PX_FORMATTED_NAME,
          FONT_QUOTE_NAME,
          'densitySpaceToggle',
        ],
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Density']),
            destination: 'spacing-trimmed.css',
            format: 'css/variables',
            options: {
              selector: ':root, [data-density]',
              outputReferences: false,
            },
          },
        ],
      },
    },
  })

  const densityAllVerbose = new StyleDictionary({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: [
          'name/kebab',
          PX_TO_REM_NAME,
          PX_FORMATTED_NAME,
          FONT_QUOTE_NAME,
          'densitySpaceToggle',
        ],
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Density']),
            destination: 'spacing-verbose.css',
            format: 'css/variables',
            options: {
              selector: ':root, [data-density]',
              outputReferences: outputReferencesTransformed,
            },
          },
        ],
      },
    },
  })

  const densitySpaciousTrimmed = new StyleDictionary({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Density', 'Spacious']),
            destination: 'spacious-trimmed.css',
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

  const densityComfortableTrimmed = new StyleDictionary({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_COMFORTABLE_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: path.join(cssBuildPath, spacingBuildPath),
        transforms: cssTransforms,
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Density', 'Comfortable']),
            destination: 'comfortable-trimmed.css',
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

  await spacingPrimitives.buildAllPlatforms()
  await densityComfortable.buildAllPlatforms()
  await densitySpacious.buildAllPlatforms()
  await densitySpaciousTrimmed.buildAllPlatforms()
  await densityComfortableTrimmed.buildAllPlatforms()
  await densityAllTrimmed.buildAllPlatforms()
  await densityAllVerbose.buildAllPlatforms()

  // Create new css variable files to support spacing variables with proportions (squished, squared, stretched)
  // The tokens in the space proportion files reference the density aware tokens, so we need to include the density aware tokens in the source
  // and the density aware tokens reference the spacing primitives
  // there is also multiple tokens referencing the Figma values
  const FIGMA_SPECIFIC_TOKENS_SOURCE = path.join(
    tokensDir,
    FILE_KEY_SPACING,
    '⛔️ Figma.Value.json',
  )
  const DENSITY_AWARE_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '💎 Density Aware.True.json',
  )

  const SPACING_PROPORTIONS_SQUARED_SOURCE = path.join(
    tokensDir,
    FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
    '🪐 Space proportions.Squared.json',
  )

  const proportionConfigs = ['Squished', 'Squared', 'Stretched'] as const

  const createProportionsDictionary = (proportion: string) => {
    const proportionLower = proportion.toLowerCase()
    const sourcePath = path.join(
      tokensDir,
      FILE_KEY_TYPOGRAPHY_AND_SPACING_MODES,
      `🪐 Space proportions.${proportion}.json`,
    )

    return new StyleDictionary({
      include: [
        SPACING_PRIMITIVE_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_AWARE_SOURCE,
        DENSITY_SPACIOUS_SOURCE,
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
                includeTokenFilter(token, [proportion]),
              destination: `space-proportions-${proportionLower}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-space-proportions="${proportionLower}"]`,
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

    return new StyleDictionary({
      include: [
        SPACING_PRIMITIVE_SOURCE,
        FIGMA_SPECIFIC_TOKENS_SOURCE,
        DENSITY_AWARE_SOURCE,
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
                selector: `[data-selectable-space="${sizeLower}"]`,
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
}
