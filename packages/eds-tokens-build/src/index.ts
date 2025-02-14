/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { TransformedToken } from 'style-dictionary/types'
import { outputReferencesTransformed } from 'style-dictionary/utils'
import { readJsonFiles } from '@equinor/eds-tokens-sync'
import { StyleDictionary } from 'style-dictionary-utils'
import path from 'path'
import fs from 'fs'
import { pxToRem, PX_TO_REM_NAME } from './transform/pxToRem'
import { fontQuote, FONT_QUOTE_NAME } from './transform/fontQuote'
import { pxFormatted, PX_FORMATTED_NAME } from './transform/pxFormatted'
import { createLightDarkTransform } from './transform/lightDark'
import { createDensitySpaceToggleTransform } from './transform/densitySpaceToggle'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { _extend } from './utils'

// Get the script's directory path for ESM
const TOKENS_DIR_FILE_PATH = path.resolve(process.cwd(), 'tokens')

const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'

const darkColorSchemeCollectionFile = '02 🌗 Color scheme.Dark.json'
const darkTokens = readJsonFiles([
  path.join(
    TOKENS_DIR_FILE_PATH,
    'ZrJNpIhcHprG9bFpHlHcWa',
    darkColorSchemeCollectionFile,
  ),
])

const spacingComfortableTokens = readJsonFiles([
  path.join(
    TOKENS_DIR_FILE_PATH,
    FILE_KEY_TYPOGRAPHY_MODES,
    '💎 Density.Comfortable.json',
  ),
])

const lightDarkTransform = createLightDarkTransform({
  name: 'lightDark',
  darkTokensObject: darkTokens[darkColorSchemeCollectionFile],
})

const densitySpaceToggleTransform = createDensitySpaceToggleTransform({
  name: 'densitySpaceToggle',
  tokens: spacingComfortableTokens['💎 Density.Comfortable.json'],
})

StyleDictionary.registerTransform(lightDarkTransform)
StyleDictionary.registerTransform(densitySpaceToggleTransform)
StyleDictionary.registerTransform(pxFormatted)
StyleDictionary.registerTransform(pxToRem)
StyleDictionary.registerTransform(fontQuote)

const cssTransforms = [
  'name/kebab',
  PX_TO_REM_NAME,
  PX_FORMATTED_NAME,
  FONT_QUOTE_NAME,
]
const outputDirectory = path.resolve(process.cwd(), 'build')
export const cssBuildPath = path.join(outputDirectory, 'css')
export const jsBuildPath = path.join(outputDirectory, 'js')
export const jsonBuildPath = path.join(outputDirectory, 'json')

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

export async function run({ outputReferences } = { outputReferences: true }) {
  console.info('Running Style Dictionary build script')
  console.info('outputReferences:', outputReferences)
  console.info('Tokens directory:', TOKENS_DIR_FILE_PATH)

  const prefix = 'eds'
  const colorBuildPath = 'color/'
  const spacingBuildPath = 'spacing/'

  const COLOR_TOKENS_DIR = path.join(
    TOKENS_DIR_FILE_PATH,
    'ZrJNpIhcHprG9bFpHlHcWa',
  )
  const COLOR_PRIMITIVE_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    '01 🎨 Colors.Mode 1.json',
  )
  console.info('COLOR_PRIMITIVE_SOURCE:', COLOR_PRIMITIVE_SOURCE)
  console.info('File exists:', fs.existsSync(COLOR_PRIMITIVE_SOURCE))

  const COLOR_LIGHT_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    '02 🌗 Color scheme.Light.json',
  )

  const COLOR_DARK_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    '02 🌗 Color scheme.Dark.json',
  )

  const primitives = _extend({
    source: [COLOR_PRIMITIVE_SOURCE],
    buildPath: colorBuildPath,
    fileName: 'primitives',
    outputReferences: false, // The primitives should not reference other tokens. This can always be false.
    transforms: cssTransforms,
  })

  const lightMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    fileName: 'light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: true,
  })

  const darkMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    fileName: 'dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: true,
  })

  const lightModeTrimmed = _extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    fileName: 'light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: false,
  })

  const darkModeTrimmed = _extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    fileName: 'dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: false,
  })

  const lightDarkColorsTrimmed = new StyleDictionary({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: path.join(cssBuildPath, colorBuildPath),
        transforms: ['name/kebab', 'color/css', 'lightDark'],
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Light']),
            destination: 'colors-trimmed.css',
            format: 'css/variables',
            options: {
              outputReferences: false, // The trimmed colors should not reference other tokens
            },
          },
        ],
      },
    },
  })

  const lightDarkColorsVerbose = new StyleDictionary({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: path.join(cssBuildPath, colorBuildPath),
        transforms: ['name/kebab', 'color/css', 'lightDark'],
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Light']),
            destination: 'colors-verbose.css',
            format: 'css/variables',
            options: {
              outputReferences: outputReferencesTransformed,
            },
          },
        ],
      },
    },
  })

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

  await primitives.buildAllPlatforms()
  await lightMode.buildAllPlatforms()
  await lightModeTrimmed.buildAllPlatforms()
  await darkMode.buildAllPlatforms()
  await darkModeTrimmed.buildAllPlatforms()
  await lightDarkColorsVerbose.buildAllPlatforms()
  await lightDarkColorsTrimmed.buildAllPlatforms()

  await spacingPrimitives.buildAllPlatforms()
  await densityComfortable.buildAllPlatforms()
  await densitySpacious.buildAllPlatforms()
  await densitySpaciousTrimmed.buildAllPlatforms()
  await densityComfortableTrimmed.buildAllPlatforms()
  await densityAllTrimmed.buildAllPlatforms()
  await densityAllVerbose.buildAllPlatforms()
}
