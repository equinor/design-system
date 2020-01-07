import prettier from 'prettier'
import { fetchFigmaFile, processFigmaFile } from '../functions/figma'
import { writeFile, writeResults } from '../functions/file'
import { makeTokens } from '../files/design-tokens'
import { PATHS, FILE_IDS } from '../constants'
import { jsonToCssString } from '../transformers/jsonToCss'
import { jsonToCssClassString } from '../transformers/jsonToCssClass'

const TOKENS_LIB_DIR = PATHS.BASE_TOKENS

const PATHS_ = {
  BASE_TOKENS_JS: `${TOKENS_LIB_DIR}/js`,
  BASE_TOKENS_JSON: `${TOKENS_LIB_DIR}/json`,
  BASE_TOKENS_CSS: `${TOKENS_LIB_DIR}/css`,
}

const writeJSTokens = (tokens) => {
  writeResults(tokens, PATHS_.BASE_TOKENS_JS, 'js')

  const baseIndexContent = `${tokens
    .map((token) => `import { ${token.name} } from './${token.name}'`)
    .join('\n')}

  export const tokens = {
    ${tokens.map((token) => token.name).join(',\n')}
  }
  `

  writeFile(
    PATHS_.BASE_TOKENS_JS,
    'index',
    'js',
    prettier.format(baseIndexContent, {
      semi: false,
      trailingComma: 'all',
      singleQuote: true,
    }),
  )

  // Disabled – shouldn’t really be done here…
  // writeFile(`${TOKENS_DIR}`, 'index', 'js', `export { tokens } from './base'`)
}

const writeJsonTokens = (tokens) => {
  writeResults(tokens, PATHS_.BASE_TOKENS_JSON, 'json')
}

const writeCSSTokens = (tokens) => {
  const cssConverter = (name) => {
    if (name === 'text') {
      return jsonToCssClassString
    }
    return jsonToCssString
  }

  const cssFiles = tokens.map((token) => {
    const cssValue = cssConverter(token.name)(token.value)

    return {
      ...token,
      value: cssValue,
    }
  })

  writeResults(cssFiles, PATHS_.BASE_TOKENS_CSS, 'css')
}

export async function createTokens(ctx) {
  try {
    const data = await fetchFigmaFile(FILE_IDS.TOKENS)

    const figmaFile = processFigmaFile(data)
    const tokens = makeTokens(figmaFile)

    writeJSTokens(tokens)
    writeJsonTokens(tokens)
    writeCSSTokens(tokens)

    ctx.response.body = JSON.stringify(tokens)
  } catch (err) {
    ctx.response.status = err.status || 500
    ctx.response.body = err.message
  }
}
