import * as R from 'ramda'

export const camelize = (str) => {
  if (str) {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase(),
      )
      .replace(/\s+/g, '')
  }
  throw new Error('No string provided to camelize()!')
}

const removeForbiddenCharacters = (str) => {
  if (str) {
    return str.replace(/[|]|[.]|[-]|[–]|[—]/g, '')
  }
  throw new Error('No string for formatName()!')
}

export const getFigmaNamePath = (str) => {
  const path = removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .split('/')
  const name = path.pop()
  return { name, path: pathToString(path) }
}

export const formatName = (str) =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .replace(/[/]/g, '--')
    .replace('---', '-')

export const pathToString = (str) =>
  str.reduce((acc, val) => `${acc}/${val}`, '')

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
