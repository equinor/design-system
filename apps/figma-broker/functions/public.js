import { jsonToSassString } from '../transformers/jsonToSass'
import { jsonToCssString } from '../transformers/jsonToCss'
import { jsonToSassClassString } from '../transformers/jsonToSassClass'
import { jsonToCssClassString } from '../transformers/jsonToCssClass'

export const convert = (tokenFiles) =>
  tokenFiles.map((tokenFile) => ({
    ...tokenFile,
    sassString: sassConverter(tokenFile.name)(tokenFile.tokens),
    cssString: cssConverter(tokenFile.name)(tokenFile.tokens),
  }))

const sassConverter = (name) => {
  if (name === 'text') {
    return jsonToSassClassString
  }
  return jsonToSassString
}

const cssConverter = (name) => {
  if (name === 'text') {
    return jsonToCssClassString
  }
  return jsonToCssString
}
