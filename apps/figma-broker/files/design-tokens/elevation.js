import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { px } from '@units'
import { fillToRgba } from '@transformers'

const toBoxShadow = (effect) =>
  `${px(effect.offset.x)} ${px(effect.offset.y)} ${px(
    effect.radius,
  )} ${fillToRgba(effect)}`

const toElevationTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('rectangle')),
  R.map((node) => {
    let name = ''
    let value = ''
    try {
      name = propName(node.name)
      value = node.effects
        .reduce((acc, effect) => [...acc, toBoxShadow(effect)], [])
        .toString()
    } catch (error) {
      throw Error(`Error parsing elevation for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)

export const makeElevationTokens = (elevations) => toElevationTokens(elevations)
