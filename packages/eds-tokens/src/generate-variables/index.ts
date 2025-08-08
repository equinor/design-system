/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { StyleDictionary } from 'style-dictionary-utils'
import {
  pxTransform,
  PX_TO_REM_NAME,
  PX_FORMATTED_NAME,
  FONT_QUOTE_NAME,
  fontQuote,
  pxFormatted,
  pxToRem,
  createFoundationColorVariables,
  createClassicColorVariables,
  createMatrixColorVariables,
  createSpacingAndTypographyVariables,
} from '@equinor/eds-tokens-build'

const outputDirectory = `${process.cwd()}/build`
export const cssBuildPath = `${outputDirectory}/css`
export const jsBuildPath = `${outputDirectory}/js`
export const jsonBuildPath = `${outputDirectory}/json`

StyleDictionary.registerTransform(pxFormatted)
StyleDictionary.registerTransform(pxTransform)
StyleDictionary.registerTransform(pxToRem)
StyleDictionary.registerTransform(fontQuote)

export async function generate() {
  const TOKENS_DIR_FILE_PATH = `${process.cwd()}/tokens`
  console.info('Running Style Dictionary build script')
  console.info('Tokens directory:', TOKENS_DIR_FILE_PATH)

  const colorBuildPath = `color/`

  const cssTransforms = [
    'name/kebab',
    PX_TO_REM_NAME,
    PX_FORMATTED_NAME,
    FONT_QUOTE_NAME,
  ]

  await createFoundationColorVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssBuildPath: cssBuildPath,
    colorBuildPath: colorBuildPath,
    cssTransforms,
  })

  await createClassicColorVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssBuildPath: cssBuildPath,
    colorBuildPath: colorBuildPath,
    cssTransforms,
  })

  await createMatrixColorVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    colorBuildPath: colorBuildPath,
    prefix: 'eds-color',
  })

  await createSpacingAndTypographyVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssBuildPath: cssBuildPath,
    cssTransforms,
  })
}

generate()
  .then(() => {
    console.log('✅ Variables generated successfully')
  })
  .catch((error) => {
    console.error('❌ Error generating color variables:', error)
  })
