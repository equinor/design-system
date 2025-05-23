/* eslint-disable @typescript-eslint/no-explicit-any */
import { readJsonFiles } from '@equinor/eds-tokens-sync'
import { StyleDictionary } from 'style-dictionary-utils'
import {
  includeTokenFilter,
  createLightDarkTransform,
  _extend,
} from '@equinor/eds-tokens-build'

export async function generateColorVariables({
  tokensDir,
  colorBuildPath,
  coreTokensDirName = '9Jody75rpiDhyTgNm3xOHd',
  colorMatrixTokensDirName = 'l61klzmHcRrHVk7Ag0eLGn',
  prefix,
  fileNames = {
    colorScheme: {
      dark: '🌗 Color scheme.Dark.json',
      light: '🌗 Color scheme.Light.json',
    },
    appearance: {
      accent: '🎨 Appearance.Accent.json',
      neutral: '🎨 Appearance.Neutral.json',
      danger: '🎨 Appearance.Danger.json',
      success: '🎨 Appearance.Success.json',
      warning: '🎨 Appearance.Warning.json',
      info: '🎨 Appearance.Info.json',
    },
  },
}: {
  tokensDir: string
  colorBuildPath: string
  coreTokensDirName?: string
  colorMatrixTokensDirName?: string
  prefix?: string
  fileNames?: {
    colorScheme: {
      dark: string
      light: string
    }
    appearance: {
      accent: string
      neutral: string
      danger: string
      success: string
      warning: string
      info: string
    }
  }
}) {
  const COLOR_BRAND_DIR = `${tokensDir}/${coreTokensDirName}`
  const COLOR_BRAND_SOURCE = `${COLOR_BRAND_DIR}/Core.Mode 1.json`

  const COLOR__MATRIX_TOKENS_DIR = `${tokensDir}/${colorMatrixTokensDirName}`

  const COLOR_MATRIX_COLOR_SCHEME_DARK_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.colorScheme.dark}`

  const darkTokenMatrix = readJsonFiles([COLOR_MATRIX_COLOR_SCHEME_DARK_SOURCE])

  const lightDarkMatrixTransform = createLightDarkTransform({
    name: 'lightDarkMatrix',
    darkTokensObject: darkTokenMatrix[fileNames.colorScheme.dark],
  })

  StyleDictionary.registerTransform(lightDarkMatrixTransform)

  const COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.colorScheme.light}`

  const COLOR_MATRIX_ACCENT_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.appearance.accent}`

  const transforms = ['name/kebab', 'color/css', 'lightDarkMatrix']
  const outputReferences = false
  const include = [COLOR_BRAND_SOURCE, COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE]

  const functional = _extend({
    source: [COLOR_MATRIX_COLOR_SCHEME_LIGHT_SOURCE],
    filter: (token: any) => {
      return (
        token.name.includes('functional') &&
        !token.name.includes('light') &&
        !token.name.includes('dark')
      )
    },
    fileName: 'matrix-functional',
    prefix,
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  functional.buildAllPlatforms()

  const accent = _extend({
    source: [COLOR_MATRIX_ACCENT_SOURCE],
    filter: (token: any) => includeTokenFilter(token, ['Accent']),
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
    filter: (token: any) => includeTokenFilter(token, ['Accent']),
    fileName: 'matrix-standalone-accent',
    prefix: 'eds-color-accent',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await accentStandalone.buildAllPlatforms()

  const COLOR_MATRIX_NEUTRAL_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.appearance.neutral}`

  const natural = _extend({
    source: [COLOR_MATRIX_NEUTRAL_SOURCE],
    filter: (token: any) => includeTokenFilter(token, ['Neutral']),
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
    filter: (token: any) => includeTokenFilter(token, ['Neutral']),
    fileName: 'matrix-standalone-neutral',
    prefix: 'eds-color-neutral',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await neutralStandalone.buildAllPlatforms()

  const COLOR_MATRIX_DANGER_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.appearance.danger}`

  const danger = _extend({
    source: [COLOR_MATRIX_DANGER_SOURCE],
    filter: (token: any) => includeTokenFilter(token, ['Danger']),
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
    filter: (token: any) => includeTokenFilter(token, ['Danger']),
    fileName: 'matrix-standalone-danger',
    prefix: 'eds-color-danger',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await dangerStandalone.buildAllPlatforms()

  const COLOR_MATRIX_SUCCESS_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.appearance.success}`

  const success = _extend({
    source: [COLOR_MATRIX_SUCCESS_SOURCE],
    filter: (token: any) => includeTokenFilter(token, ['Success']),
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
    filter: (token: any) => includeTokenFilter(token, ['Success']),
    fileName: 'matrix-standalone-success',
    prefix: 'eds-color-success',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await successStandalone.buildAllPlatforms()

  const COLOR_MATRIX_WARNING_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.appearance.warning}`

  const warning = _extend({
    source: [COLOR_MATRIX_WARNING_SOURCE],
    filter: (token: any) => includeTokenFilter(token, ['Warning']),
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
    filter: (token: any) => includeTokenFilter(token, ['Warning']),
    fileName: 'matrix-standalone-warning',
    prefix: 'eds-color-warning',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await warningStandalone.buildAllPlatforms()

  const COLOR_MATRIX_INFO_SOURCE = `${COLOR__MATRIX_TOKENS_DIR}/${fileNames.appearance.info}`

  const info = _extend({
    source: [COLOR_MATRIX_INFO_SOURCE],
    filter: (token: any) => includeTokenFilter(token, ['Info']),
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
    filter: (token: any) => includeTokenFilter(token, ['Info']),
    fileName: 'matrix-standalone-info',
    prefix: 'eds-color-info',
    include,
    buildPath: colorBuildPath,
    outputReferences,
    transforms,
  })

  await infoStandalone.buildAllPlatforms()
}
