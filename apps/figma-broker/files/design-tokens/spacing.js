import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { px } from '@units'

const toComfortable = (x) => ({ comfortable: x })

const toSpacingTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('component')),
  R.map((node) => {
    let name
    let value = ''
    try {
      name = propName(node.name)
      value = px(node.absoluteBoundingBox.height)
    } catch (error) {
      throw Error(`Error parsing spacing for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
  toComfortable,
)
export const makeSpacingTokens = (spacings) => toSpacingTokens(spacings)
