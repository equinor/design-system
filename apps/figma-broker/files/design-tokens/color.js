import R from 'ramda'
import { propName, withType, pickChildren, isNotEmpty } from '@utils'
import { fillToRgba, fillToHex, fillToHsla, toCSSVars } from '@transformers'

const findMode = (name) => {
  if (/⚫/.test(name)) {
    return 'dark'
  }

  return 'default'
}

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

const cssVarName = (name) => `eds_${name}`

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
          rgba: `var(--${cssVarName(name)}, ${fillToRgba(fill)})`,
        }
      } catch (error) {
        throw Error(`Error parsing color for ${node.name}. ${error.message}`)
      }
      return {
        name,
        value,
        mode,
      }
    }),
    toDictMode,
    R.dissoc('modes'),
  )(colors)

export const makeColorCss = R.pipe(
  R.mapObjIndexed((group, groupName) =>
    R.mapObjIndexed(({ rgba }, name) => {
      const pureRgba = rgba.match(
        /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/gi,
      )

      return {
        name: cssVarName(`${groupName}_${name}`),
        value: pureRgba[0],
      }
    }, group),
  ),
  R.values,
  R.map(R.values),
  R.flatten,
  toCSSVars,
)
