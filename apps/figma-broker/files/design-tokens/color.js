import * as R from 'ramda'
import { propName, withType, pickChildren, toDictDeep } from '@utils'
import { fillToRgba, fillToHex, fillToHsla, toCSSVars } from '@transformers'

export const makeColorToken = (colors, getStyle) =>
  R.pipe(
    R.filter(withType('frame')),
    pickChildren,
    R.filter(withType('rectangle')),
    R.map((node) => {
      let name = ''
      let value = ''
      try {
        // We use style name to avoid typos in layer representing said token
        const style = getStyle(node.styles.fill)
        name = propName(style.name)

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
      }
    }),
    toDictDeep,
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
