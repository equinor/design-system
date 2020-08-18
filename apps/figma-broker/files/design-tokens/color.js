import R from 'ramda'
import {
  propName,
  withType,
  pickChildren,
  toDictDeep,
  isNotEmpty,
} from '@utils'
import { fillToRgba, fillToHex, fillToHsla, toCSSVars } from '@transformers'
import { colors } from '../../../../libraries/tokens/base/colors'

const findMode = (name) => {
  if (/⚫/.test(name)) {
    return 'dark'
  }

  return 'default'
}
// ['interactive', 'table__cell__fill_activated']
// ['modes', 'dark', 'interactive', 'table__cell__fill_activated]
export const toDictMode = R.curry(R.reduce)(
  (acc, { name, value, mode }) =>
    R.set(
      R.pipe(
        R.split(new RegExp(/(^[^_]+)/)),
        R.filter(isNotEmpty),
        R.map(R.curry(R.replace)(/\_*/, '')),
        (path) => (mode === 'default' ? path : ['modes', mode, ...path]),
        R.lensPath,
      )(name),
      value,
      acc,
    ),
  {},
)

export const makeColorToken = (colors, getStyle) =>
  R.pipe(
    R.filter(withType('frame')),
    pickChildren,
    R.filter(withType('rectangle')),
    R.map((node) => {
      let mode,
        value,
        name = ''
      try {
        // We use style name to avoid typos in layer representing said token
        const style = getStyle(node.styles.fill)
        mode = findMode(style.name)
        name = propName(style.name).replace(/⚫️__|⚪️__/, '')

        const fill = R.find(withType('solid'), node.fills)
        value = {
          hex: fillToHex(fill),
          hsla: fillToHsla(fill),
          rgba: fillToRgba(fill),
        }
      } catch (error) {
        throw Error(`Error parsing color for ${name}. ${error.message}`)
      }
      return {
        name,
        value,
        mode,
      }
    }),
    toDictMode,
  )(colors)

export const makeColorCss = R.pipe(
  R.mapObjIndexed((group, groupName) =>
    R.mapObjIndexed(
      (colors, colorName) => ({
        name: `eds_${groupName}_${colorName}`,
        value: colors.rgba,
      }),
      group,
    ),
  ),
  R.values,
  R.map(R.values),
  R.flatten,
  toCSSVars,
)

const darkTheme = { ...colors, ...colors.modes.dark }
