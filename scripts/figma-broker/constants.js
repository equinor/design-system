const COMMON_DIR = '../../common'
//variables = tokens but calling it tokens triggers snyk
const VARIABLES_DIR = '../../packages/eds-tokens'
const ASSETS_DIR = '../../assets'
const ICONS_DIR = '../../packages/eds-icons'
const STORYBOOK_DIR = '../../packages/eds-core-react/stories'

export const PATHS = {
  TOKENS: VARIABLES_DIR,
  BASE_TOKENS: `${VARIABLES_DIR}/src/base`,
  COMPONENTS_TOKENS: `${VARIABLES_DIR}/components`,
  ASSETS_ICONS: `${ASSETS_DIR}/icons`,
  SASS: `${COMMON_DIR}/public/sass`,
  CSS: `${COMMON_DIR}/public/css`,
  ICONS: `${STORYBOOK_DIR}/assets/icons`,
  ICON_FILES: `${ICONS_DIR}/src`,
  FIGMA: `${VARIABLES_DIR}/figma`,
}
