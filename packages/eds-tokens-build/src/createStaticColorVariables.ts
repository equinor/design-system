import path from 'path'
import { _extend } from './utils'
import type { TransformedToken } from 'style-dictionary/types'
import { includeTokenFilter } from './filter/includeTokenFilter'

export async function createStaticColorVariables({
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

  const lightColorSemanticVerbose = _extend({
    source: [SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'static-semantic-light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: true,
  })

  const lightColorSemanticTrimmed = _extend({
    source: [SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'static-semantic-light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences: false,
  })

  const darkColorSemanticVerbose = _extend({
    source: [SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_DARK_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'static-semantic-dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: true,
  })

  const darkColorSemanticTrimmed = _extend({
    source: [SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_DARK_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'static-semantic-dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences: false,
  })

  await lightColorSemanticVerbose.buildAllPlatforms()
  await lightColorSemanticTrimmed.buildAllPlatforms()
  await darkColorSemanticVerbose.buildAllPlatforms()
  await darkColorSemanticTrimmed.buildAllPlatforms()
}
