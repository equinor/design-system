import * as R from 'ramda'
import { formatName, withType, pickChildren, toDict } from '@utils'
import { px } from '@units'

const toHeightTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('component')),
  pickChildren,
  R.map((node) => {
    let name
    let value = ''
    try {
      name = formatName(node.name)
      value = px(node.absoluteBoundingBox.height)
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

export const makeClickboundsTokens = (clickbounds) =>
  toHeightTokens(clickbounds)
