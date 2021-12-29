import * as R from 'ramda'
import {
  propName,
  withType,
  pickChildren,
  toDictDeep,
} from '../../functions/utils'
import { px } from '../../functions/units'
import { fillToRgba, toCSSVars } from '../../transformers'

const toBoxShadow = (effect) =>
  `${px(effect.offset.x)} ${px(effect.offset.y)} ${px(
    effect.radius,
  )} ${fillToRgba(effect)}`

export const makeElevationTokens = (elevations, getStyle) =>
  R.pipe(
    R.filter(withType('frame')),
    pickChildren,
    R.filter(withType('rectangle')),
    R.map((node) => {
      let name = ''
      let value = ''
      try {
        const style = getStyle(node.styles.effect)
        name = propName(style.name)
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
    toDictDeep,
    R.view(R.lensProp('elevation')),
  )(elevations)

export const makeElevationCss = R.pipe(
  R.mapObjIndexed((value, name) => ({ name: `eds_elevation_${name}`, value })),
  R.values,
  toCSSVars,
)
