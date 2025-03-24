/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { readJsonFiles } from '@equinor/eds-tokens-sync'
import fs from 'fs'
import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import { outputReferencesTransformed } from 'style-dictionary/utils'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { createLightDarkTransform } from './transform/lightDark'
import { _extend } from './utils'

export async function createClassicColorVariables({
  tokensDir,
  cssBuildPath,
  colorBuildPath,
  cssTransforms,
}: {
  tokensDir: string
  cssBuildPath: string
  colorBuildPath: string
  cssTransforms: string[]
}) {
  const darkColorSchemeCollectionFile = '🌗 Color scheme.Dark.json'
  const lightColorSchemeCollectionFile = '🌗 Color scheme.Light.json'
  const coreColorCollectionFile = 'Core.Mode 1.json'

  const COLOR_TOKENS_DIR = path.join(tokensDir, 'ZrJNpIhcHprG9bFpHlHcWa')
  const COLOR_BRAND_DIR = path.join(tokensDir, '9Jody75rpiDhyTgNm3xOHd')
  const COLOR_BRAND_SOURCE = path.join(COLOR_BRAND_DIR, coreColorCollectionFile)

  const darkTokens = readJsonFiles([
    path.join(
      tokensDir,
      'ZrJNpIhcHprG9bFpHlHcWa',
      darkColorSchemeCollectionFile,
    ),
  ])

  const lightDarkTransform = createLightDarkTransform({
    name: 'lightDark',
    darkTokensObject: darkTokens[darkColorSchemeCollectionFile],
  })

  StyleDictionary.registerTransform(lightDarkTransform)

  console.info('COLOR_BRAND_SOURCE:', COLOR_BRAND_SOURCE)
  console.info('File exists:', fs.existsSync(COLOR_BRAND_SOURCE))

  const COLOR_LIGHT_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    lightColorSchemeCollectionFile,
  )

  const COLOR_DARK_SOURCE = path.join(
    COLOR_TOKENS_DIR,
    darkColorSchemeCollectionFile,
  )

  const primitives = _extend({
    source: [COLOR_BRAND_SOURCE],
    buildPath: colorBuildPath,
    fileName: 'primitives',
    outputReferences: false, // The primitives should not reference other tokens. This can always be false.
    transforms: cssTransforms,
  })

  const lightMode = _extend({
    include: [COLOR_BRAND_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    fileName: 'light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: true,
  })

  const darkMode = _extend({
    include: [COLOR_BRAND_SOURCE],
    source: [COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    fileName: 'dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: true,
  })

  const lightModeTrimmed = _extend({
    include: [COLOR_BRAND_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    fileName: 'light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: false,
  })

  const darkModeTrimmed = _extend({
    include: [COLOR_BRAND_SOURCE],
    source: [COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    fileName: 'dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: false,
  })

  const lightDarkColorsTrimmed = new StyleDictionary({
    include: [COLOR_BRAND_SOURCE],
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
    include: [COLOR_BRAND_SOURCE],
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
