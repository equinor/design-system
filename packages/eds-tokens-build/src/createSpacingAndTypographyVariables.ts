import { readJsonFiles } from '@equinor/eds-tokens-sync'
import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import { outputReferencesTransformed } from 'style-dictionary/utils'
import {
  TOKENS_DIR_FILE_PATH,
  FILE_KEY_SPACING,
  FILE_KEY_TYPOGRAPHY_MODES,
  cssTransforms,
  cssBuildPath,
} from '.'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { createDensitySpaceToggleTransform } from './transform/densitySpaceToggle'
import { FONT_QUOTE_NAME } from './transform/fontQuote'
import { PX_FORMATTED_NAME } from './transform/pxFormatted'
import { PX_TO_REM_NAME } from './transform/pxToRem'
import { _extend } from './utils'

export async function createSpacingAndTypographyVariables() {
  const prefix = 'eds'
  const spacingBuildPath = 'spacing/'
  const outputReferences = true

  const SPACING_PRIMITIVE_SOURCE = path.join(
    TOKENS_DIR_FILE_PATH,
    FILE_KEY_SPACING,
    '👾 Primitives.Value.json',
  )
  const DENSITY_FIGMA_SOURCE = path.join(
    TOKENS_DIR_FILE_PATH,
    FILE_KEY_SPACING,
    '⛔️ Figma.Value.json',
  )
  const DENSITY_SPACIOUS_SOURCE = path.join(
    TOKENS_DIR_FILE_PATH,
    FILE_KEY_TYPOGRAPHY_MODES,
    '💎 Density.Spacious.json',
  )
  const DENSITY_COMFORTABLE_SOURCE = path.join(
    TOKENS_DIR_FILE_PATH,
    FILE_KEY_TYPOGRAPHY_MODES,
    '💎 Density.Comfortable.json',
  )

  const spacingComfortableTokens = readJsonFiles([
    path.join(
      TOKENS_DIR_FILE_PATH,
      FILE_KEY_TYPOGRAPHY_MODES,
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
}
