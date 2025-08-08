import path from 'path'
import { _extend } from './utils'
import type { TransformedToken } from 'style-dictionary/types'
import { includeTokenFilter } from './filter/includeTokenFilter'

export async function createColorVariablesDynamic({
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

  const SEMANTIC_COLOR_TOKENS_DIR = path.join(
    tokensDir,
    'nyPaQ3QnI1UAcxKW4a0d2c',
  )

  const NEUTRAL_SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    '🎨 Appearance.Neutral.json',
  )

  const ACCENT_SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    '🎨 Appearance.Accent.json',
  )

  const SUCCESS_SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    '🎨 Appearance.Success.json',
  )

  const INFO_SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    '🎨 Appearance.Info.json',
  )

  const WARNING_SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    '🎨 Appearance.Warning.json',
  )

  const DANGER_SEMANTIC_COLOR_TOKENS_FILE = path.join(
    SEMANTIC_COLOR_TOKENS_DIR,
    '🎨 Appearance.Danger.json',
  )

  const FILTER = (token: TransformedToken) =>
    includeTokenFilter(token, ['Appearance'])

  const neutralColorSemanticVerbose = _extend({
    source: [NEUTRAL_SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-dynamic-neutral',
    selector: ':root, [data-color-appearance="neutral"]',
    outputReferences: true,
  })

  const accentColorSemanticVerbose = _extend({
    source: [ACCENT_SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-dynamic-accent',
    selector: '[data-color-appearance="accent"]',
    outputReferences: true,
  })

  const successColorSemanticVerbose = _extend({
    source: [SUCCESS_SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-dynamic-success',
    selector: '[data-color-appearance="success"]',
    outputReferences: true,
  })

  const infoColorSemanticVerbose = _extend({
    source: [INFO_SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-dynamic-info',
    selector: '[data-color-appearance="info"]',
    outputReferences: true,
  })

  const warningColorSemanticVerbose = _extend({
    source: [WARNING_SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-dynamic-warning',
    selector: '[data-color-appearance="warning"]',
    outputReferences: true,
  })

  const dangerColorSemanticVerbose = _extend({
    source: [DANGER_SEMANTIC_COLOR_TOKENS_FILE],
    include: [FOUNDATION_COLOR_LIGHT_FILE],
    filter: FILTER,
    buildPath: colorBuildPath,
    prefix: PREFIX,
    fileName: 'semantic-dynamic-danger',
    selector: '[data-color-appearance="danger"]',
    outputReferences: true,
  })

  await neutralColorSemanticVerbose.buildAllPlatforms()
  await accentColorSemanticVerbose.buildAllPlatforms()
  await successColorSemanticVerbose.buildAllPlatforms()
  await infoColorSemanticVerbose.buildAllPlatforms()
  await warningColorSemanticVerbose.buildAllPlatforms()
  await dangerColorSemanticVerbose.buildAllPlatforms()
}
