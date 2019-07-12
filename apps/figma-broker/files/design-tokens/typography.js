import * as R from 'ramda'
import { formatName, withType, pickChildren, toDict } from '@utils'

const toTypographyTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('text')),
  R.map((x) => {
    let name
    let value = ''
    try {
      name = formatName(x.name)
      value = x.style
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
