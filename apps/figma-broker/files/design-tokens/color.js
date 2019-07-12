import { map } from 'ramda'
import { formatName } from '@utils'

const getChildren = (acc, x) => [...acc, ...x.children]

export const makeColorToken = (colorTokens) =>
  colorTokens
    .filter((x) => x.type === 'FRAME')
    .reduce(getChildren, [])
    .filter((x) => x.type === 'RECTANGLE')
    .map((x) => {
      let name = ''
      let value = ''
      try {
        name = formatName(x.name)
        const fill = x.fills.find((x) => x.type === 'SOLID')
        value = colorString(fill.color)
      } catch (error) {
        throw Error(`Error parsing color for ${name}. ${error.message}`)
      }
      return {
        name,
        value,
      }
    })
    .reduce((acc, { name, value }) => {
      acc[name] = value
      return acc
    }, {})

const colorString = (color) => {
  const { r, g, b, a } = map((x) => Math.round(x * 100) / 100, color)
  const rgbColors = map((x) => Math.round(x * 255), { r, g, b })

  return `rgba(${rgbColors.r}, ${rgbColors.g}, ${rgbColors.b}, ${a * 1})`
}
