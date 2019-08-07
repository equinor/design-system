import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { toTypography } from '@transformers'

export const makeTextTokens = (typographies, getStyle) =>
  R.pipe(
    R.filter(withType('frame')),
    pickChildren,
    R.filter(withType('text')),
    R.map((node) => {
      let name
      let value = ''
      try {
        const style = getStyle(node.styles.text)
        name = propName(style.name)
        value = toTypography(node, name)
      } catch (error) {
        throw Error(`Error parsing typography for ${name}. ${error.message}`)
      }
      return {
        name,
        value,
      }
    }),
    toDict,
  )(typographies)
