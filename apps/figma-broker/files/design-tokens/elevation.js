import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { px } from '@units'
import { colortoRgba } from '@transformers'

const toBoxShadow = (offset, radius, color) =>
  `${px(offset.x)} ${px(offset.y)} ${px(radius)} ${colortoRgba(color)}`

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
        .reduce(
          (acc, val) => [
            ...acc,
            toBoxShadow(val.offset, val.radius, val.color),
          ],
          [],
        )
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
