import {
  includeTokenFilter,
  _extend,
  PX_TRANSFORM_NAME,
} from '@equinor/eds-tokens-build'

export const FILE_KEY = 'V3XAAjEw7dl2vQmDvG4RNW'

export async function generateSpacingVariables({
  tokensDir,
  cssTransforms,
}: {
  tokensDir: string
  cssTransforms: string[]
}) {
  const SPACING_SOURCE = `${tokensDir}/${FILE_KEY}/01 Spacing.Mode 1.json`
  const PADDING_XS_SOURCE = `${tokensDir}/${FILE_KEY}/03 Padding.XS.json`
  const PADDING_SM_SOURCE = `${tokensDir}/${FILE_KEY}/03 Padding.SM.json`
  const PADDING_MD_SOURCE = `${tokensDir}/${FILE_KEY}/03 Padding.MD.json`

  const SQUISHED_SOURCE = `${tokensDir}/${FILE_KEY}/02 Ratio.Squished.json`
  const STRETCHED_SOURCE = `${tokensDir}/${FILE_KEY}/02 Ratio.Stretched.json`
  const SQUARED_SOURCE = `${tokensDir}/${FILE_KEY}/02 Ratio.Squared.json`
  const BUILD_PATH = '/spacing/'

  const spacing = _extend({
    source: [SPACING_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'spacing',
    filter: (token) => includeTokenFilter(token),
    transforms: [...cssTransforms, PX_TRANSFORM_NAME],
  })

  const xs = _extend({
    source: [PADDING_XS_SOURCE],
    include: [
      SPACING_SOURCE,
      SQUARED_SOURCE,
      SQUISHED_SOURCE,
      STRETCHED_SOURCE,
    ],
    buildPath: BUILD_PATH,
    fileName: 'selectable-padding-xs',
    selector: ':root, [data-padding="xs"]',
    filter: (token) => includeTokenFilter(token, ['Padding']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const sm = _extend({
    source: [PADDING_SM_SOURCE],
    include: [
      SPACING_SOURCE,
      SQUARED_SOURCE,
      SQUISHED_SOURCE,
      STRETCHED_SOURCE,
    ],
    buildPath: BUILD_PATH,
    fileName: 'selectable-padding-sm',
    selector: '[data-padding="sm"]',
    filter: (token) => includeTokenFilter(token, ['Padding']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const md = _extend({
    source: [PADDING_MD_SOURCE],
    include: [
      SPACING_SOURCE,
      SQUARED_SOURCE,
      SQUISHED_SOURCE,
      STRETCHED_SOURCE,
    ],
    buildPath: BUILD_PATH,
    fileName: 'selectable-padding-md',
    selector: '[data-padding="md"]',
    filter: (token) => includeTokenFilter(token, ['Padding']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const squished = _extend({
    source: [SQUISHED_SOURCE],
    include: [SPACING_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'selectable-ratio-squished',
    selector: ':root, [data-ratio="squished"]',
    filter: (token) => includeTokenFilter(token, ['Squished']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const stretched = _extend({
    source: [STRETCHED_SOURCE],
    include: [SPACING_SOURCE],
    buildPath: BUILD_PATH,
    fileName: 'selectable-ratio-stretched',
    selector: '[data-ratio="stretched"]',
    filter: (token) => includeTokenFilter(token, ['Stretched']),
    transforms: cssTransforms,
    outputReferences: true,
  })

  const squared = _extend({
    source: [SQUARED_SOURCE],
    include: [SPACING_SOURCE],
    buildPath: BUILD_PATH,
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
