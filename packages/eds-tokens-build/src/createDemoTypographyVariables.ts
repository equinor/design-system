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
  // const FONT_SIZE_XS_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '02 Font size.XS.json',
  // )
  // const FONT_SIZE_SM_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '02 Font size.SM.json',
  // )
  // const FONT_SIZE_MD_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '02 Font size.MD.json',
  // )
  // const FONT_SIZE_LG_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '02 Font size.LG.json',
  // )

  // const FONT_WEIGHT_BOLD_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '03 Font weight.Bold.json',
  // )
  // const FONT_WEIGHT_REGULAR_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '03 Font weight.Regular.json',
  // )
  // const LINEHEIGHT_NORMAL_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '04 Lineheight.Normal.json',
  // )
  // const LINEHEIGHT_SQUISHED_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '04 Lineheight.Squished.json',
  // )
  // const BASELINE_ALIGNED_TRUE_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '05 Baseline aligned.True.json',
  // )
  // const BASELINE_ALIGNED_FALSE_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '05 Baseline aligned.False.json',
  // )

  const typography = _extend({
    source: [TYPOGRAPHY_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'typography',
    filter: (token) => includeTokenFilter(token),
    transforms: cssTransforms,
  })

  await typography.buildAllPlatforms()

  // const SQUISHED_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '02 Ratio.Squished.json',
  // )
  // const STRETCHED_SOURCE = path.join(
  //   tokensDir,
  //   FILE_KEY,
  //   '02 Ratio.Stretched.json',
  // )
  // const SQUARED_SOURCE = path.join(tokensDir, FILE_KEY, '02 Ratio.Squared.json')
  // const BUILD_PATH = '/demo/'

  // const spacing = _extend({
  //   source: [SPACING_SOURCE],
  //   buildPath: BUILD_PATH,
  //   fileName: 'spacing',
  //   filter: (token) => includeTokenFilter(token),
  //   transforms: [...cssTransforms, PX_TRANSFORM_NAME],
  // })

  // const xs = _extend({
  //   source: [PADDING_XS_SOURCE],
  //   include: [
  //     SPACING_SOURCE,
  //     SQUARED_SOURCE,
  //     SQUISHED_SOURCE,
  //     STRETCHED_SOURCE,
  //   ],
  //   buildPath: BUILD_PATH,
  //   fileName: 'selectable-padding-xs',
  //   selector: ':root, [data-padding="xs"]',
  //   filter: (token) => includeTokenFilter(token, ['Padding']),
  //   transforms: cssTransforms,
  //   outputReferences: true,
  // })

  // const sm = _extend({
  //   source: [PADDING_SM_SOURCE],
  //   include: [
  //     SPACING_SOURCE,
  //     SQUARED_SOURCE,
  //     SQUISHED_SOURCE,
  //     STRETCHED_SOURCE,
  //   ],
  //   buildPath: BUILD_PATH,
  //   fileName: 'selectable-padding-sm',
  //   selector: '[data-padding="sm"]',
  //   filter: (token) => includeTokenFilter(token, ['Padding']),
  //   transforms: cssTransforms,
  //   outputReferences: true,
  // })

  // const md = _extend({
  //   source: [PADDING_MD_SOURCE],
  //   include: [
  //     SPACING_SOURCE,
  //     SQUARED_SOURCE,
  //     SQUISHED_SOURCE,
  //     STRETCHED_SOURCE,
  //   ],
  //   buildPath: BUILD_PATH,
  //   fileName: 'selectable-padding-md',
  //   selector: '[data-padding="md"]',
  //   filter: (token) => includeTokenFilter(token, ['Padding']),
  //   transforms: cssTransforms,
  //   outputReferences: true,
  // })

  // const squished = _extend({
  //   source: [SQUISHED_SOURCE],
  //   include: [SPACING_SOURCE],
  //   buildPath: BUILD_PATH,
  //   fileName: 'selectable-ratio-squished',
  //   selector: ':root, [data-ratio="squished"]',
  //   filter: (token) => includeTokenFilter(token, ['Squished']),
  //   transforms: cssTransforms,
  //   outputReferences: true,
  // })

  // const stretched = _extend({
  //   source: [STRETCHED_SOURCE],
  //   include: [SPACING_SOURCE],
  //   buildPath: BUILD_PATH,
  //   fileName: 'selectable-ratio-stretched',
  //   selector: '[data-ratio="stretched"]',
  //   filter: (token) => includeTokenFilter(token, ['Stretched']),
  //   transforms: cssTransforms,
  //   outputReferences: true,
  // })

  // const squared = _extend({
  //   source: [SQUARED_SOURCE],
  //   include: [SPACING_SOURCE],
  //   buildPath: BUILD_PATH,
  //   fileName: 'selectable-ratio-squared',
  //   selector: '[data-ratio="squared"]',
  //   filter: (token) => includeTokenFilter(token, ['Squared']),
  //   transforms: cssTransforms,
  //   outputReferences: true,
  // })

  // await xs.buildAllPlatforms()
  // await md.buildAllPlatforms()
  // await sm.buildAllPlatforms()
  // await spacing.buildAllPlatforms()
  // await squished.buildAllPlatforms()
  // await stretched.buildAllPlatforms()
  // await squared.buildAllPlatforms()
}
