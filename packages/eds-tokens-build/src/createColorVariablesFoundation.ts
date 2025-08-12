import path from 'path'
import { _extend } from './utils'
import { mergeLightDarkFoundation } from './utils/mergeLightDarkFoundation'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { TransformedToken } from 'style-dictionary/types'

export async function createColorVariablesFoundation({
  tokensDir,
  colorBuildPath,
}: {
  tokensDir: string
  cssBuildPath: string
  colorBuildPath: string
  cssTransforms: string[]
}) {
  const PREFIX = 'eds-color'
  const FOUNDATION_COLOR_TOKENS_DIR = path.join(
    tokensDir,
    'GnovDpL3UV6X51Ot7Kv6Im',
  )
  const COLORS_LIGHT = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    'Color Light.Mode 1.json',
  )

  const COLORS_DARK = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    'Color Dark.Mode 1.json',
  )

  const COLORS_LIGHT_SCHEME = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    '🌗 Color scheme.Light.json',
  )

  const COLORS_DARK_SCHEME = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    '🌗 Color scheme.Dark.json',
  )

  const lightColorScheme = _extend({
    source: [COLORS_LIGHT_SCHEME],
    include: [COLORS_LIGHT],
    filter: (token: TransformedToken) =>
      includeTokenFilter(token, ['Color scheme']),
    buildPath: colorBuildPath,
    fileName: 'light-color-scheme',
    selector: '[data-color-scheme="light"]',
    prefix: PREFIX,
    outputReferences: false,
  })

  const darkColorScheme = _extend({
    source: [COLORS_DARK_SCHEME],
    include: [COLORS_DARK],
    filter: (token: TransformedToken) =>
      includeTokenFilter(token, ['Color scheme']),
    buildPath: colorBuildPath,
    fileName: 'dark-color-scheme',
    selector: '[data-color-scheme="dark"]',
    prefix: PREFIX,
    outputReferences: false,
  })

  await lightColorScheme.buildAllPlatforms()
  await darkColorScheme.buildAllPlatforms()

  // Merge light and dark foundation files using light-dark() function
  mergeLightDarkFoundation({
    prefix: PREFIX,
  })
}
