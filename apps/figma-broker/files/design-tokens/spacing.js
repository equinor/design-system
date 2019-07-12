import { formatName } from '@utils'

export const makeSpacingTokens = (spacingTokens) =>
  spacingTokens
    .filter((x) => x.type === 'FRAME')
    .reduce((acc, x) => [...acc, ...x.children], [])
    .filter((x) => x.type === 'COMPONENT')
    .map((spacing) => {
      let name
      let value = ''
      try {
        name = formatName(spacing.name)
        value = spacingString(spacing.absoluteBoundingBox.height)
      } catch (error) {
        throw Error(`Height not found for ${name}. ${error.message}`)
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

const spacingString = (spacing) => `${spacing}px`
