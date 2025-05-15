/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import path from 'path'
import { includeTokenFilter } from './filter/includeTokenFilter'
import { _extend } from './utils'
import { PX_TRANSFORM_NAME } from './transform/pxTransform'

export const FILE_KEY = '4bTwgrm9k6g0T23n5l4ZFz'
// export const FILE_KEY = 'V3XAAjEw7dl2vQmDvG4RNW'

export async function createSpacingAndTypographyDemoVariables({
  tokensDir,
  cssTransforms,
}: {
  tokensDir: string
  cssTransforms: string[]
}) {
  const SPACING_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '01 Spacing.Mode 1.json',
  )

  const spacing = _extend({
    source: [SPACING_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'spacing',
    filter: (token) => includeTokenFilter(token),
    transforms: [...cssTransforms, PX_TRANSFORM_NAME],
  })

  const PADDING_XS_SOURCE = path.join(tokensDir, FILE_KEY, '02 Padding.XS.json')
  const PADDING_SM_SOURCE = path.join(tokensDir, FILE_KEY, '02 Padding.SM.json')
  const PADDING_MD_SOURCE = path.join(tokensDir, FILE_KEY, '02 Padding.MD.json')

  const SQUISHED_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '03 Ratio.Squished.json',
  )
  const STRETCHED_SOURCE = path.join(
    tokensDir,
    FILE_KEY,
    '03 Ratio.Stretched.json',
  )
  const SQUARED_SOURCE = path.join(tokensDir, FILE_KEY, '03 Ratio.Squared.json')

  const xs = _extend({
    include: [SPACING_SOURCE],
    source: [PADDING_XS_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'selectable-padding-xs',
    selector: ':root, [data-padding="xs"]',
    filter: (token) => includeTokenFilter(token, ['Padding']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const sm = _extend({
    include: [SPACING_SOURCE],
    source: [PADDING_SM_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'selectable-padding-sm',
    selector: '[data-padding="sm"]',
    filter: (token) => includeTokenFilter(token, ['Padding']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const md = _extend({
    include: [SPACING_SOURCE],
    source: [PADDING_MD_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'selectable-padding-md',
    selector: '[data-padding="md"]',
    filter: (token) => includeTokenFilter(token, ['Padding']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const squished = _extend({
    include: [
      SPACING_SOURCE,
      PADDING_MD_SOURCE,
      PADDING_SM_SOURCE,
      PADDING_XS_SOURCE,
    ],
    source: [SQUISHED_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'selectable-ratio-squished',
    selector: ':root, [data-ratio="squished"]',
    filter: (token) => includeTokenFilter(token, ['Squished']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const stretched = _extend({
    include: [
      SPACING_SOURCE,
      PADDING_MD_SOURCE,
      PADDING_SM_SOURCE,
      PADDING_XS_SOURCE,
    ],
    source: [STRETCHED_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'selectable-ratio-stretched',
    selector: '[data-ratio="stretched"]',
    filter: (token) => includeTokenFilter(token, ['Stretched']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const squared = _extend({
    include: [
      SPACING_SOURCE,
      PADDING_MD_SOURCE,
      PADDING_SM_SOURCE,
      PADDING_XS_SOURCE,
    ],
    source: [SQUARED_SOURCE],
    buildPath: '/spacing/demo/',
    fileName: 'selectable-ratio-squared',
    selector: '[data-ratio="squared"]',
    filter: (token) => includeTokenFilter(token, ['Squared']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  await xs.buildAllPlatforms()
  await md.buildAllPlatforms()
  await sm.buildAllPlatforms()
  await spacing.buildAllPlatforms()
  await squished.buildAllPlatforms()
  await stretched.buildAllPlatforms()
  await squared.buildAllPlatforms()
}
