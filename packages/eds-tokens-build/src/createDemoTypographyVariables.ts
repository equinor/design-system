/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import path from 'path'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { _extend } from './utils'
// import { PX_TRANSFORM_NAME } from './transform/pxTransform'

export const FILE_KEY = 'FS9KIlmO8N8rv3rAO65UUi'

export async function createDemoTypographyVariables({
  tokensDir,
  cssTransforms,
}: {
  tokensDir: string
  cssTransforms: string[]
}) {
  const BUILD_PATH = '/demo/typography/'
  const TYPOGRAPHY_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '01 Typography.Value.json',
  )
  const FONT_SIZE_XS_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '02 Font size.XS.json',
  )
  const FONT_SIZE_SM_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '02 Font size.SM.json',
  )
  const FONT_SIZE_MD_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '02 Font size.MD.json',
  )
  const FONT_SIZE_LG_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '02 Font size.LG.json',
  )

  const typography = _extend({
    source: [TYPOGRAPHY_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'typography',
    filter: (token) => includeTokenFilter(token),
    transforms: cssTransforms,
  })

  const xs = _extend({
    source: [FONT_SIZE_XS_SOURCE],
    include: [TYPOGRAPHY_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'font-size-xs',
    selector: ':root, [data-font-size="xs"]',
    filter: (token) => includeTokenFilter(token, ['Font size']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const sm = _extend({
    source: [FONT_SIZE_SM_SOURCE],
    include: [TYPOGRAPHY_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'font-size-sm',
    selector: '[data-font-size="sm"]',
    filter: (token) => includeTokenFilter(token, ['Font size']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const md = _extend({
    source: [FONT_SIZE_MD_SOURCE],
    include: [TYPOGRAPHY_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'font-size-md',
    selector: '[data-font-size="md"]',
    filter: (token) => includeTokenFilter(token, ['Font size']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const lg = _extend({
    source: [FONT_SIZE_LG_SOURCE],
    include: [TYPOGRAPHY_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'font-size-lg',
    selector: '[data-font-size="lg"]',
    filter: (token) => includeTokenFilter(token, ['Font size']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const FONT_WEIGHT_REGULAR_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '03 Font weight.Regular.json',
  )

  const FONT_WEIGHT_BOLD_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '03 Font weight.Bold.json',
  )

  const regular = _extend({
    source: [FONT_WEIGHT_REGULAR_SOURCE],
    include: [TYPOGRAPHY_SOURCE, FONT_SIZE_XS_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'font-weight-regular',
    selector: ':root, [data-font-weight="regular"]',
    filter: (token) => includeTokenFilter(token, ['Font weight']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const bold = _extend({
    source: [FONT_WEIGHT_BOLD_SOURCE],
    include: [TYPOGRAPHY_SOURCE, FONT_SIZE_XS_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'font-weight-bold',
    selector: '[data-font-weight="bold"]',
    filter: (token) => includeTokenFilter(token, ['Font weight']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  await regular.buildAllPlatforms()
  await bold.buildAllPlatforms()

  await typography.buildAllPlatforms()
  await xs.buildAllPlatforms()
  await sm.buildAllPlatforms()
  await md.buildAllPlatforms()
  await lg.buildAllPlatforms()

  const LINE_HEIGHT_NORMAL_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '04 Lineheight.Normal.json',
  )
  const LINE_HEIGHT_SQUISHED_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '04 Lineheight.Squished.json',
  )

  const lineHeightNormal = _extend({
    source: [LINE_HEIGHT_NORMAL_SOURCE],
    include: [TYPOGRAPHY_SOURCE, FONT_SIZE_XS_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'line-height-normal',
    selector: ':root, [data-line-height="normal"]',
    filter: (token) => includeTokenFilter(token, ['Lineheight']),
    transforms: cssTransforms,
    outputReferences: true,
  })
  const lineHeightSquished = _extend({
    source: [LINE_HEIGHT_SQUISHED_SOURCE],
    include: [TYPOGRAPHY_SOURCE, FONT_SIZE_XS_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'line-height-squished',
    selector: '[data-line-height="squished"]',
    filter: (token) => includeTokenFilter(token, ['Lineheight']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  await lineHeightNormal.buildAllPlatforms()
  await lineHeightSquished.buildAllPlatforms()

  const BASELINE_ALIGNED_TRUE_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '05 Baseline aligned.True.json',
  )
  const BASELINE_ALIGNED_FALSE_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '05 Baseline aligned.False.json',
  )

  const baselineAlignedTrue = _extend({
    source: [BASELINE_ALIGNED_TRUE_SOURCE],
    include: [TYPOGRAPHY_SOURCE, FONT_SIZE_XS_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'baseline-aligned-true',
    selector: ':root, [data-baseline-aligned="true"]',
    filter: (token) => includeTokenFilter(token, ['Baseline aligned']),
    transforms: cssTransforms,
    outputReferences: true,
  })
  const baselineAlignedFalse = _extend({
    source: [BASELINE_ALIGNED_FALSE_SOURCE],
    include: [TYPOGRAPHY_SOURCE, FONT_SIZE_XS_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'baseline-aligned-false',
    selector: '[data-baseline-aligned="false"]',
    filter: (token) => includeTokenFilter(token, ['Baseline aligned']),
    transforms: cssTransforms,
    outputReferences: true,
  })
  await baselineAlignedTrue.buildAllPlatforms()
  await baselineAlignedFalse.buildAllPlatforms()
}
