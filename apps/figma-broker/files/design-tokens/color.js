import * as R from 'ramda'
import { propName, withType, pickChildren, toDict, colortoRgba } from '@utils'

const toColorTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('rectangle')),
  R.map((node) => {
    let name = ''
    let value = ''
    try {
      name = propName(node.name)
      const fill = R.find(withType('solid'), node.fills)
      value = colortoRgba(fill.color)
    } catch (error) {
      throw Error(`Error parsing color for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)

export const makeColorToken = (colors) => toColorTokens(colors)
