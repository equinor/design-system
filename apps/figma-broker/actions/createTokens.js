import prettier from 'prettier'
import R from 'ramda'
import { fetchFigmaFile, processFigmaFile } from '../functions/figma'
import { writeFile, writeResults } from '../functions/file'
import { makeTokens } from '../files/design-tokens'
import { makeColorCss } from '../files/design-tokens/color'
import { makeSpacingCss } from '../files/design-tokens/spacing'
import { makeElevationCss } from '../files/design-tokens/elevation'
import { makeClickboundsCss } from '../files/design-tokens/clickbounds'
import { makeTypographyCss } from '../files/design-tokens/typography'
import { makeShapeCss } from '../files/design-tokens/shape'
import { PATHS, FILE_IDS } from '../constants'
import { mergeStrings } from '@utils'

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
            const typographyCss = makeTypographyCss(value)
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

  writeFile(PATHS.TOKENS, 'tokens', 'css', root)
  writeFile(PATHS.TOKENS, 'elements', 'css', elements)
}

export async function createTokens(ctx) {
  const data = await fetchFigmaFile(FILE_IDS.TOKENS)

  const figmaFile = processFigmaFile(data)
  const tokens = makeTokens(figmaFile)

  writeJSTokens(tokens)
  // writeJsonTokens(tokens)
  writeCSSTokens(tokens)

  return tokens
}
