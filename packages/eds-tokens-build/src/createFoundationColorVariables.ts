import path from 'path'
import { _extend } from './utils'
import { mergeLightDarkFoundation } from './utils/mergeLightDarkFoundation'

export async function createFoundationColorVariables({
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

  const FOUNDATION_COLOR_LIGHT_FILE = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    '🌗 Color scheme.Light.json',
  )

  const FOUNDATION_COLOR_DARK_FILE = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    '🌗 Color scheme.Dark.json',
  )

  const lightColorFoundation = _extend({
    source: [FOUNDATION_COLOR_LIGHT_FILE],
    buildPath: colorBuildPath,
    fileName: 'light-foundation',
    selector: ':root, [data-color-scheme="light"]',
    prefix: PREFIX,
    outputReferences: true,
  })

  const darkColorFoundation = _extend({
    source: [FOUNDATION_COLOR_DARK_FILE],
    buildPath: colorBuildPath,
    fileName: 'dark-foundation',
    selector: '[data-color-scheme="dark"]',
    prefix: PREFIX,
    outputReferences: true,
  })

  await lightColorFoundation.buildAllPlatforms()
  await darkColorFoundation.buildAllPlatforms()

  // Merge light and dark foundation files using light-dark() function
  mergeLightDarkFoundation({
    prefix: PREFIX,
  })
}
