/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

// Get the script's directory path for ESM
export const TOKENS_DIR_FILE_PATH = path.resolve(process.cwd(), 'tokens')

export const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
export const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'
export const colorBuildPath = 'color/'
const outputDirectory = path.resolve(process.cwd(), 'build')
export const cssBuildPath = path.join(outputDirectory, 'css')
export const jsBuildPath = path.join(outputDirectory, 'js')
export const jsonBuildPath = path.join(outputDirectory, 'json')

StyleDictionary.registerTransform(pxFormatted)
StyleDictionary.registerTransform(pxToRem)
StyleDictionary.registerTransform(fontQuote)

export const cssTransforms = [
  'name/kebab',
  PX_TO_REM_NAME,
  PX_FORMATTED_NAME,
  FONT_QUOTE_NAME,
]

export async function run() {
  console.info('Running Style Dictionary build script')
  console.info('Tokens directory:', TOKENS_DIR_FILE_PATH)

  await createClassicColorVariables()
  await createSpacingAndTypographyVariables()
  await createMatrixColorVariables()
}
