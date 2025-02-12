/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { TransformedToken } from 'style-dictionary/types'
import { outputReferencesTransformed } from 'style-dictionary/utils'
import { readJsonFiles } from '@equinor/eds-tokens-sync'
import { StyleDictionary } from 'style-dictionary-utils'

const TOKENS_DIR = './tokens'
const FILE_KEY_PRIMITIVES = 'cVaqjfgt3gDiqbx10q3Pj8'
const FILE_KEY_COLORS = 'aRgKtCisnm98k9kVy6zasL'
const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'

import { pxToRem, PX_TO_REM_NAME } from './transform/pxToRem'
import { fontQuote, FONT_QUOTE_NAME } from './transform/fontQuote'
import { pxFormatted, PX_FORMATTED_NAME } from './transform/pxFormatted'
import { createLightDarkTransform } from './transform/lightDark'
import { createDensitySpaceToggleTransform } from './transform/densitySpaceToggle'
import { includeTokenFilter } from './filter/includeTokenFilter'

const darkColorSchemeCollectionFile = '🌗 Colour scheme.Dark.json'
const lightColorSchemeCollectionFile = '🌗 Colour scheme.Light.json'

const oldDarkTokens = readJsonFiles([
  `./${TOKENS_DIR}/${FILE_KEY_COLORS}/${darkColorSchemeCollectionFile}`,
])

const newDarkColorSchemeCollectionFile = '02 🌗 Color scheme.Dark.json'
const newDarkTokens = readJsonFiles([
  `./${TOKENS_DIR}/ZrJNpIhcHprG9bFpHlHcWa/${newDarkColorSchemeCollectionFile}`,
])

const spacingComfortableTokens = readJsonFiles([
  `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`,
])

const oldLightDarkTransform = createLightDarkTransform({
  name: 'lightDark',
  darkTokensObject: oldDarkTokens[darkColorSchemeCollectionFile],
})
StyleDictionary.registerTransform(oldLightDarkTransform)

const newLightDarkTransform = createLightDarkTransform({
  name: 'newLightDark',
  darkTokensObject: newDarkTokens[newDarkColorSchemeCollectionFile],
})
StyleDictionary.registerTransform(newLightDarkTransform)

const densitySpaceToggleTransform = createDensitySpaceToggleTransform({
  name: 'densitySpaceToggle',
  tokens: spacingComfortableTokens['💎 Density.Comfortable.json'],
})

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
const outputDirectory = './build'
const cssBuildPath = `${outputDirectory}/css`
const jsBuildPath = `${outputDirectory}/js`
const jsonBuildPath = `${outputDirectory}/json`

const _extend = ({
  source,
  fileName,
  buildPath,
  prefix,
  selector,
  filter,
  include,
  outputReferences,
  transforms,
}: {
  include?: string[]
  source: string[]
  fileName: string
  buildPath: string
  prefix?: string
  selector?: string
  filter?: (token: TransformedToken) => boolean
  outputReferences?: boolean
  transforms?: string[]
}) => {
  const cssFileNameOutputVersion = outputReferences ? 'verbose' : 'trimmed'
  const cssDestinationFileName = `${fileName}-${cssFileNameOutputVersion}.css`

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return new StyleDictionary({
    include,
    source,
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/${buildPath}/`,
        transforms,
        files: [
          {
            filter,
            destination: cssDestinationFileName,
            format: 'css/variables',
            options: {
              selector,
              outputReferences,
            },
          },
        ],
      },
      ts: {
        //transformGroup: 'js',
        transforms: ['name/constant'],
        buildPath: `${jsBuildPath}/${buildPath}/`,
        files: [
          {
            filter,
            destination: `${fileName}.js`,
            format: 'javascript/es6',
          },
          {
            filter,
            format: 'typescript/es6-declarations',
            destination: `${fileName}.d.ts`,
          },
        ],
      },
      json: {
        buildPath: `${jsonBuildPath}/${buildPath}/`,
        transforms: ['name/kebab'],
        files: [
          {
            filter,
            destination: `flat/${fileName}.json`,
            format: 'json/flat',
          },
          {
            filter,
            destination: `nested/${fileName}.json`,
            format: 'json/nested',
          },
        ],
      },
    },
  })
}

const COLOR_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_PRIMITIVES}/🎨 Color.Color.json`
const COLOR_SIMPLE_SEMANTIC_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_COLORS}/🗣️ Simple semantic.Mode 1.json`
const SPACING_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/👾 Primitives.Value.json`
const COLOR_LIGHT_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_COLORS}/${lightColorSchemeCollectionFile}`
const COLOR_DARK_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_COLORS}/${darkColorSchemeCollectionFile}`

const DENSITY_FIGMA_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/⛔️ Figma.Value.json`
const DENSITY_SPACIOUS_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Spacious.json`
const DENSITY_COMFORTABLE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`

export async function run({ outputReferences } = { outputReferences: true }) {
  console.info('Running Style Dictionary build script')
  console.info('outputReferences:', outputReferences)

  const prefix = 'eds'
  const colorBuildPath = 'color/'
  const spacingBuildPath = 'spacing/'

  const NEW_TOKENS_DIR = `./${TOKENS_DIR}/ZrJNpIhcHprG9bFpHlHcWa`
  const NEW_BASE_SOURCE = `${NEW_TOKENS_DIR}/01 🎨 Colors.Mode 1.json`
  const NEW_COLOR_LIGHT_SOURCE = `${NEW_TOKENS_DIR}/02 🌗 Color scheme.Light.json`
  const NEW_COLOR_DARK_SOURCE = `${NEW_TOKENS_DIR}/02 🌗 Color scheme.Dark.json`

  const newLightMode = _extend({
    include: [NEW_BASE_SOURCE],
    source: [NEW_COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    fileName: 'new-light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: false,
  })

  const newDarkMode = _extend({
    include: [NEW_BASE_SOURCE],
    source: [NEW_COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    fileName: 'new-dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: false,
  })

  const newLightDarkColorsTrimmed = new StyleDictionary({
    include: [NEW_BASE_SOURCE],
    source: [NEW_COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: `${cssBuildPath}/color/`,
        transforms: ['name/kebab', 'color/css', 'newLightDark'],
        files: [
          {
            filter: (token: TransformedToken) =>
              includeTokenFilter(token, ['Light']),
            destination: 'new-colors-trimmed.css',
            format: 'css/variables',
            options: {
              outputReferences: false, // The trimmed colors should not reference other tokens
            },
          },
        ],
      },
    },
  })

  const primitives = _extend({
    source: [COLOR_PRIMITIVE_SOURCE],
    buildPath: colorBuildPath,
    prefix,
    fileName: 'primitives',
    outputReferences: false, // The primitives should not reference other tokens. This can always be false.
    transforms: cssTransforms,
  })

  const simpleSemantic = _extend({
    source: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Simple semantic']),
    buildPath: colorBuildPath,
    prefix,
    fileName: 'simple-semantic',
    outputReferences,
    transforms: cssTransforms,
  })

  const lightMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    prefix,
    fileName: 'light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences,
    transforms: cssTransforms,
  })

  const darkMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    prefix,
    fileName: 'dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences,
    transforms: cssTransforms,
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
        buildPath: `${cssBuildPath}/spacing/`,
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
        buildPath: `${cssBuildPath}/spacing/`,
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
        buildPath: `${cssBuildPath}/${spacingBuildPath}`,
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
        buildPath: `${cssBuildPath}/${spacingBuildPath}`,
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

  const lightDarkColorsVerbose = new StyleDictionary({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/color/`,
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

  const lightDarkColorsTrimmed = new StyleDictionary({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/color/`,
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

  await primitives.buildAllPlatforms()
  await simpleSemantic.buildAllPlatforms()
  await lightMode.buildAllPlatforms()
  await darkMode.buildAllPlatforms()
  await lightDarkColorsVerbose.buildAllPlatforms()
  await lightDarkColorsTrimmed.buildAllPlatforms()
  await spacingPrimitives.buildAllPlatforms()
  await densityComfortable.buildAllPlatforms()
  await densitySpacious.buildAllPlatforms()
  await densitySpaciousTrimmed.buildAllPlatforms()
  await densityComfortableTrimmed.buildAllPlatforms()
  await densityAllTrimmed.buildAllPlatforms()
  await densityAllVerbose.buildAllPlatforms()
  await newLightMode.buildAllPlatforms()
  await newDarkMode.buildAllPlatforms()
  await newLightDarkColorsTrimmed.buildAllPlatforms()
}
