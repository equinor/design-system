import * as R from 'ramda'
import { formatName, withType, pickChildren, toDict } from '@utils'
import { toTypography } from '@units'

const toTypographyTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('text')),
  R.map((node) => {
    let name
    let value = ''
    try {
      name = formatName(node.name)
      value = toTypography(node)
    } catch (error) {
      throw Error(`Height not found for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)

export const makeTextTokens = (typographies) => toTypographyTokens(typographies)
