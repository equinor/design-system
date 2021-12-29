import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '../../functions/utils'
import { px } from '../../functions/units'
import { toCSSVars } from '../../transformers'

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

export const makeSpacingCss = R.pipe(
  R.prop('comfortable'),
  R.mapObjIndexed((value, name) => ({ name: `eds_spacing_${name}`, value })),
  R.values,
  toCSSVars,
)
