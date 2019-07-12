import * as R from 'ramda'

const removeForbiddenCharacters = (str) => {
  if (str) {
    return str.replace(/[|]|[.]|[-]|[–]|[—]/g, '')
  }
  throw new Error('No string for formatName()!')
}

export const formatName = (str) =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .replace(/[/]/g, '--')
    .replace('---', '-')

export const fixPageName = (name) =>
  name
    .replace(/(🚧*)(✅*)/, '')
    .toLowerCase()
    .trim()

export const colortoRgba = (color) => {
  if (!color) {
    return 'transparent'
  }
  const { r, g, b, a } = R.map((x) => Math.round(x * 100) / 100, color)
  const rgbColors = R.map((x) => Math.round(x * 255), { r, g, b })

  return `rgba(${rgbColors.r}, ${rgbColors.g}, ${rgbColors.b}, ${a * 1})`
}

export const getSpacingValue = (name, box) => {
  if (R.test(/Vertical/, name)) {
    return box.width
  }
  if (R.test(/Horizontal/, name)) {
    return box.height
  }
  return 0
}

export const withName = R.curry((regExp, node) =>
  R.test(new RegExp(regExp, 'i'), node.name),
)
export const withType = R.curry((regExp, node) =>
  R.test(new RegExp(regExp, 'i'), node.type),
)

export const pickChildren = R.curry(R.reduce)(
  (acc, x) => [...acc, ...x.children],
  [],
)

export const toDict = R.curry(R.reduce)(
  (acc, { name, value }) => ({
    ...acc,
    [name]: value,
  }),
  {},
)
