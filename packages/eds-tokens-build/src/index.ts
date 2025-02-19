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
const colorBuildPath = 'color/'
const outputDirectory = path.resolve(process.cwd(), 'build')
export const cssBuildPath = path.join(outputDirectory, 'css')
export const jsBuildPath = path.join(outputDirectory, 'js')
export const jsonBuildPath = path.join(outputDirectory, 'json')

StyleDictionary.registerTransform(pxFormatted)
StyleDictionary.registerTransform(pxToRem)
StyleDictionary.registerTransform(fontQuote)

const cssTransforms = [
  'name/kebab',
  PX_TO_REM_NAME,
  PX_FORMATTED_NAME,
  FONT_QUOTE_NAME,
]

export async function run() {
  console.info('Running Style Dictionary build script')
  console.info('Tokens directory:', TOKENS_DIR_FILE_PATH)

  await createClassicColorVariables()
  await createSpacingAndTypographyVariables()
  await createMatrixColorVariables()
}

async function createClassicColorVariables() {
  const darkColorSchemeCollectionFile = '🌗 Color scheme.Dark.json'
  const lightColorSchemeCollectionFile = '🌗 Color scheme.Light.json'
  const primitiveColorCollectionFile = 'Brand.Mode 1.json'

  const darkTokens = readJsonFiles([
    path.join(
      TOKENS_DIR_FILE_PATH,
      'ZrJNpIhcHprG9bFpHlHcWa',
      darkColorSchemeCollectionFile,
    ),
  ])

  const lightDarkTransform = createLightDarkTransform({
    name: 'lightDark',
    darkTokensObject: darkTokens[darkColorSchemeCollectionFile],
  })

  StyleDictionary.registerTransform(lightDarkTransform)
  const COLOR_TOKENS_DIR = path.join(
    TOKENS_DIR_FILE_PATH,
    'ZrJNpIhcHprG9bFpHlHcWa',
  )
  const COLOR_PRIMITIVE_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    primitiveColorCollectionFile,
  )
  console.info('COLOR_PRIMITIVE_SOURCE:', COLOR_PRIMITIVE_SOURCE)
  console.info('File exists:', fs.existsSync(COLOR_PRIMITIVE_SOURCE))

  const COLOR_LIGHT_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    lightColorSchemeCollectionFile,
  )

  const COLOR_DARK_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    darkColorSchemeCollectionFile,
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

  await primitives.buildAllPlatforms()
  await lightMode.buildAllPlatforms()
  await lightModeTrimmed.buildAllPlatforms()
  await darkMode.buildAllPlatforms()
  await darkModeTrimmed.buildAllPlatforms()
  await lightDarkColorsVerbose.buildAllPlatforms()
  await lightDarkColorsTrimmed.buildAllPlatforms()
}

async function createMatrixColorVariables() {
  const COLOR__MATRIX_TOKENS_DIR = path.join(
    TOKENS_DIR_FILE_PATH,
    'l61klzmHcRrHVk7Ag0eLGn',
  )

  const matrixDarkColorSchemeCollectionFile = 'Color scheme.Dark.json'

  const COLOR_MATRIX_COLOR_SCHEME_DARK_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    matrixDarkColorSchemeCollectionFile,
  )

  const darkTokenMatrix = readJsonFiles([COLOR_MATRIX_COLOR_SCHEME_DARK_SOURCE])

  const lightDarkMatrixTransform = createLightDarkTransform({
    name: 'lightDarkMatrix',
    darkTokensObject: darkTokenMatrix[matrixDarkColorSchemeCollectionFile],
  })

  StyleDictionary.registerTransform(lightDarkMatrixTransform)

  const COLOR_MATRIX_COLORS_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    'Colors.Mode 1.json',
  )

  const COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    'Color scheme.Light.json',
  )

  const COLOR_MATRIX_ACCENT_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    'Appearance.Accent.json',
  )

  const transforms = ['name/kebab', 'color/css', 'lightDarkMatrix']
  const outputReferences = false
  const include = [
    COLOR_MATRIX_COLORS_SOURCE,
    COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE,
  ]
  const prefix = 'eds/color'

  const accent = _extend({
    source: [COLOR_MATRIX_ACCENT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Accent']),
    fileName: 'matrix-accent',
    selector: '[data-color-appearance="accent"]',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await accent.buildAllPlatforms()

  const COLOR_MATRIX_NEUTRAL_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    'Appearance.Neutral.json',
  )

  const natural = _extend({
    source: [COLOR_MATRIX_NEUTRAL_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Neutral']),
    fileName: 'matrix-neutral',
    selector: ':root, [data-color-appearance="neutral"]',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await natural.buildAllPlatforms()

  const danger = _extend({
    source: [path.join(COLOR__MATRIX_TOKENS_DIR, 'Appearance.Danger.json')],
    filter: (token) => includeTokenFilter(token, ['Danger']),
    fileName: 'matrix-danger',
    selector: '[data-color-appearance="danger"]',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await danger.buildAllPlatforms()

  const success = _extend({
    source: [path.join(COLOR__MATRIX_TOKENS_DIR, 'Appearance.Success.json')],
    filter: (token) => includeTokenFilter(token, ['Success']),
    fileName: 'matrix-success',
    selector: '[data-color-appearance="success"]',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await success.buildAllPlatforms()

  const warning = _extend({
    source: [path.join(COLOR__MATRIX_TOKENS_DIR, 'Appearance.Warning.json')],
    filter: (token) => includeTokenFilter(token, ['Warning']),
    fileName: 'matrix-warning',
    selector: '[data-color-appearance="warning"]',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await warning.buildAllPlatforms()

  const info = _extend({
    source: [path.join(COLOR__MATRIX_TOKENS_DIR, 'Appearance.Info.json')],
    filter: (token) => includeTokenFilter(token, ['Info']),
    fileName: 'matrix-info',
    selector: '[data-color-appearance="info"]',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await info.buildAllPlatforms()
}

async function createSpacingAndTypographyVariables() {
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
