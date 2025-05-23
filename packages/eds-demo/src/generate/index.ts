import { generateColorVariables } from './color'
import { generateSpacingVariables } from './spacing'
import { generateTypographyVariables } from './typography'
import {
  FONT_QUOTE_NAME,
  PX_FORMATTED_NAME,
  PX_TO_REM_NAME,
} from '@equinor/eds-tokens-build'

const cssTransforms = [
  'name/kebab',
  PX_TO_REM_NAME,
  PX_FORMATTED_NAME,
  FONT_QUOTE_NAME,
]

export const generate = async () => {
  const TOKENS_DIR_FILE_PATH = 'tokens' // path.resolve(process.cwd(), 'tokens')
  await generateColorVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    colorBuildPath: `color/`,
    colorMatrixTokensDirName: 'QRFchmc6GHsKSBEdqdFLMr',
    fileNames: {
      colorScheme: {
        dark: '01 Color scheme.Dark.json',
        light: '01 Color scheme.Light.json',
      },
      appearance: {
        accent: '02 Appearance.Accent.json',
        neutral: '02 Appearance.Neutral.json',
        danger: '02 Appearance.Danger.json',
        success: '02 Appearance.Success.json',
        warning: '02 Appearance.Warning.json',
        info: '02 Appearance.Info.json',
      },
    },
  })

  await generateSpacingVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssTransforms,
  })

  await generateTypographyVariables({
    tokensDir: TOKENS_DIR_FILE_PATH,
    cssTransforms,
  })
}
generate()
  .then(() => {
    console.log('✅ Variables generated successfully')
  })
  .catch((error) => {
    console.error('❌ Error generating matrix color variables:', error)
  })
