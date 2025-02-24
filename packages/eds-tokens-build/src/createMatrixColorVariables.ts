/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { readJsonFiles } from '@equinor/eds-tokens-sync'
import path from 'path'
import { StyleDictionary } from 'style-dictionary-utils'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { createLightDarkTransform } from './transform/lightDark'
import { _extend } from './utils'

export async function createMatrixColorVariables({
  tokensDir,
  colorBuildPath,
}: {
  tokensDir: string
  colorBuildPath: string
  cssTransforms: string[]
}) {
  const COLOR__MATRIX_TOKENS_DIR = path.join(
    tokensDir,
    'l61klzmHcRrHVk7Ag0eLGn',
  )

  const matrixDarkColorSchemeCollectionFile = '🌗 Color scheme.Dark.json'
  const matrixLightColorSchemeCollectionFile = '🌗 Color scheme.Light.json'

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
    'Brand.Mode 1.json',
  )

  const COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    matrixLightColorSchemeCollectionFile,
  )

  const COLOR_MATRIX_ACCENT_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    '🎨 Appearance.Accent.json',
  )

  const transforms = ['name/kebab', 'color/css', 'lightDarkMatrix']
  const outputReferences = false
  const include = [
    COLOR_MATRIX_COLORS_SOURCE,
    COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE,
  ]
  const prefix = 'eds-color'

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

  const accentStandalone = _extend({
    source: [COLOR_MATRIX_ACCENT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Accent']),
    fileName: 'matrix-standalone-accent',
    prefix: 'eds-color-accent',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await accentStandalone.buildAllPlatforms()

  const COLOR_MATRIX_NEUTRAL_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    '🎨 Appearance.Neutral.json',
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

  const neutralStandalone = _extend({
    source: [COLOR_MATRIX_NEUTRAL_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Neutral']),
    fileName: 'matrix-standalone-neutral',
    prefix: 'eds-color-neutral',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await neutralStandalone.buildAllPlatforms()

  const COLOR_MATRIX_DANGER_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    '🎨 Appearance.Danger.json',
  )

  const danger = _extend({
    source: [COLOR_MATRIX_DANGER_SOURCE],
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

  const dangerStandalone = _extend({
    source: [COLOR_MATRIX_DANGER_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Danger']),
    fileName: 'matrix-standalone-danger',
    prefix: 'eds-color-danger',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await dangerStandalone.buildAllPlatforms()

  const COLOR_MATRIX_SUCCESS_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    '🎨 Appearance.Success.json',
  )

  const success = _extend({
    source: [COLOR_MATRIX_SUCCESS_SOURCE],
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

  const successStandalone = _extend({
    source: [COLOR_MATRIX_SUCCESS_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Success']),
    fileName: 'matrix-standalone-success',
    prefix: 'eds-color-success',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await successStandalone.buildAllPlatforms()

  const COLOR_MATRIX_WARNING_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    '🎨 Appearance.Warning.json',
  )

  const warning = _extend({
    source: [COLOR_MATRIX_WARNING_SOURCE],
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

  const warningStandalone = _extend({
    source: [COLOR_MATRIX_WARNING_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Warning']),
    fileName: 'matrix-standalone-warning',
    prefix: 'eds-color-warning',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await warningStandalone.buildAllPlatforms()

  const COLOR_MATRIX_INFO_SOURCE = path.join(
    COLOR__MATRIX_TOKENS_DIR,
    '🎨 Appearance.Info.json',
  )

  const info = _extend({
    source: [COLOR_MATRIX_INFO_SOURCE],
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

  const infoStandalone = _extend({
    source: [COLOR_MATRIX_INFO_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Info']),
    fileName: 'matrix-standalone-info',
    prefix: 'eds-color-info',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await infoStandalone.buildAllPlatforms()
}
