import * as R from 'ramda'
import { getFigmaFile, processFigmaFile } from '../functions/figma.js'
import { writeFile, writeResults } from '../functions/file.js'
import { makeTokens } from '../files/design-tokens/index.js'
import { makeColorCss } from '../files/design-tokens/color.js'
import { makeSpacingCss } from '../files/design-tokens/spacing.js'
import { makeElevationCss } from '../files/design-tokens/elevation.js'
import { makeClickboundsCss } from '../files/design-tokens/clickbounds.js'
import { makeTypographyCss } from '../files/design-tokens/typography.js'
import { makeShapeCss } from '../files/design-tokens/shape.js'
import { PATHS } from '../constants.js'
import { mergeStrings } from '../functions/utils.js'

const TOKENS_LIB_DIR = PATHS.BASE_TOKENS

const PATHS_ = {
  BASE_TOKENS_JS: `${TOKENS_LIB_DIR}`,
  BASE_TOKENS_JSON: `${TOKENS_LIB_DIR}/json`,
  BASE_TOKENS_CSS: `${TOKENS_LIB_DIR}/css`,
}

const writeJSTokens = (tokens) => {
  writeResults(tokens, PATHS_.BASE_TOKENS_JS, 'ts')

  const baseIndexContent = `${tokens
    .map((token) => `import { ${token.name} } from './${token.name}'`)
    .join('\n')}

  export const tokens = {
    ${tokens.map((token) => token.name).join(',\n')}
  }
  `

  writeFile(PATHS_.BASE_TOKENS_JS, 'index', 'ts', baseIndexContent)

  // Disabled – shouldn’t really be done here…
  // writeFile(`${TOKENS_DIR}`, 'index', 'js', `export { tokens } from './base'`)
}

const writeJsonTokens = (tokens) => {
  writeResults(tokens, PATHS_.BASE_TOKENS_JSON, 'json')
}

const writeCSSTokens = (tokens) => {
  let typographyCss
  const { root, elements } = R.pipe(
    R.reduce(
      (acc, { name, value }) => {
        switch (name) {
          case 'colors':
            return { ...acc, root: [...acc.root, makeColorCss(value)] }
          case 'spacings':
            return {
              ...acc,
              root: [...acc.root, `\n${makeSpacingCss(value)}`],
            }
          case 'elevation':
            return { ...acc, root: [...acc.root, makeElevationCss(value)] }
          case 'clickbounds':
            return { ...acc, root: [...acc.root, makeClickboundsCss(value)] }
          case 'typography':
            typographyCss = makeTypographyCss(value)
            return {
              ...acc,
              root: [...acc.root, typographyCss.root],
              elements: [...acc.elements, typographyCss.elements],
            }
          case 'shape':
            return { ...acc, root: [...acc.root, makeShapeCss(value)] }
          default:
            return acc
        }
      },
      { root: [], elements: [] },
    ),

    (x) => ({
      root: `:root {\n${mergeStrings(x.root)}}`,
      elements: mergeStrings(x.elements),
    }),
  )(tokens)

  writeFile(PATHS.VARIABLES, 'tokens', 'css', root)
  writeFile(PATHS.VARIABLES, 'elements', 'css', elements)
}

export async function createTokens({ query }) {
  console.info('Started exporting tokens')

  const data = await getFigmaFile(query)

  const figmaFile = processFigmaFile(data)
  const tokens = makeTokens(figmaFile)

  writeJSTokens(tokens)
  writeJsonTokens(tokens)
  writeCSSTokens(tokens)

  console.info('Finished exporting tokens')

  return tokens
}
