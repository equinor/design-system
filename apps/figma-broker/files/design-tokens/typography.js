import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { toTypography } from '@transformers'

const toTypographyTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('text')),
  R.map((node) => {
    let name
    let value = ''
    try {
      name = propName(node.name)
      value = toTypography(node)
    } catch (error) {
      throw Error(`Error parsing typography for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)

export const makeTextTokens = (typographies) => toTypographyTokens(typographies)
