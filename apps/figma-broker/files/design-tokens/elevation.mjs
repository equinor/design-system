import { formatName } from '../../functions/utils'

const getChildren = (acc, x) => [...acc, ...x.children]

export const makeElevationTokens = (documents) =>
  documents
    .filter((x) => x.type === 'FRAME')
    .reduce(getChildren, [])
    .filter((x) => x.type === 'RECTANGLE')
    .map((x) => {
      let name,
        value = ''
      try {
        name = formatName(x.name)
        value = x.effects
          .reduce(
            (acc, val) => [
              ...acc,
              `${unitString(val.offset, val.radius)} ${colorString(val.color)}`,
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
    })
    .reduce((acc, { name, value }) => {
      acc[name] = value
      return acc
    }, {})

const colorString = ({ r, g, b, a }) =>
  `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a.toFixed(2) * 1})`

const unitString = (offset, radius) => `${offset.x}px ${offset.y}px ${radius}px`
