import path from 'path'
import { _extend } from './utils'
import type { TransformedToken } from 'style-dictionary/types'
import { includeTokenFilter } from './filter/includeTokenFilter'

export async function createColorVariablesStatic({
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

  const COLOR_LIGHT = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    'Color Light.Mode 1.json',
  )

  const FOUNDATION_COLOR_LIGHT_FILE = path.join(
    FOUNDATION_COLOR_TOKENS_DIR,
    '🌗 Color scheme.Light.json',
  )

  const SEMANTIC_COLOR_TOKENS_DIR = path.join(
    tokensDir,
    'OWxw2XogDLUt1aCvcDFXPw',
  )

  const SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    'Semantic.Mode 1.json',
  )

  const FILTER = (token: TransformedToken) =>
    includeTokenFilter(token, ['Semantic'])

  const semanticColors = _extend({
    source: [SEMANTIC_COLOR_TOKENS_FILE],
    include: [COLOR_LIGHT, FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-static',
    selector: ':root',
    outputReferences: true,
  })

  await semanticColors.buildAllPlatforms()
}
