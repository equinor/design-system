import { readJsonFiles } from '@equinor/eds-tokens-sync'
import fs from 'fs'
import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import { outputReferencesTransformed } from 'style-dictionary/utils'
import {
  TOKENS_DIR_FILE_PATH,
  colorBuildPath,
  cssTransforms,
  cssBuildPath,
} from '.'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { createLightDarkTransform } from './transform/lightDark'
import { _extend } from './utils'

export async function createClassicColorVariables() {
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
