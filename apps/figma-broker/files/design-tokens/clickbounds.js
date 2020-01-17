import * as R from 'ramda'
import { propName, withType, pickChildren, toDictDeep } from '@utils'
import { px } from '@units'
import { toCSSVars } from '@transformers'

const toHeightTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('component')),
  pickChildren,
  R.map((node) => {
    let name
    let value = ''
    try {
      name = propName(node.name)
      value = px(node.absoluteBoundingBox.height)
    } catch (error) {
      throw Error(`Error parsing clickbound for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDictDeep,
  R.view(R.lensProp('clickbounds')),
)

export const makeClickboundsTokens = (clickbounds) =>
  toHeightTokens(clickbounds)

export const makeClickboundsCss = R.pipe(
  R.mapObjIndexed((value, name) => ({ name: `eds_clickbound_${name}`, value })),
  R.values,
  toCSSVars,
)
