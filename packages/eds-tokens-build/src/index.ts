/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { StyleDictionary } from 'style-dictionary-utils'
import path from 'path'
import { pxToRem, PX_TO_REM_NAME } from './transform/pxToRem'
import { fontQuote, FONT_QUOTE_NAME } from './transform/fontQuote'
import { pxFormatted, PX_FORMATTED_NAME } from './transform/pxFormatted'
import { createSpacingAndTypographyVariables } from './createSpacingAndTypographyVariables'
import { createMatrixColorVariables } from './createMatrixColorVariables'
import { createClassicColorVariables } from './createClassicColorVariables'

const outputDirectory = path.resolve(process.cwd(), 'build')
export const cssBuildPath = path.join(outputDirectory, 'css')
export const jsBuildPath = path.join(outputDirectory, 'js')
export const jsonBuildPath = path.join(outputDirectory, 'json')

StyleDictionary.registerTransform(pxFormatted)
StyleDictionary.registerTransform(pxToRem)
StyleDictionary.registerTransform(fontQuote)

export async function run() {
  const TOKENS_DIR_FILE_PATH = path.resolve(process.cwd(), 'tokens')
  console.info('Running Style Dictionary build script')
  console.info('Tokens directory:', TOKENS_DIR_FILE_PATH)

  const colorBuildPath = 'color/'

  const cssTransforms = [
    'name/kebab',
    PX_TO_REM_NAME,
    PX_FORMATTED_NAME,
    FONT_QUOTE_NAME,
  ]

  await createMatrixColorVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    colorBuildPath: colorBuildPath,
    cssTransforms,
  })

  await createClassicColorVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssBuildPath: cssBuildPath,
    colorBuildPath: colorBuildPath,
    cssTransforms,
  })
  await createSpacingAndTypographyVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssBuildPath: cssBuildPath,
    cssTransforms,
  })
}
