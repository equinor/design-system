import { formatName } from '@utils'

const getChildren = (acc, x) => [...acc, ...x.children]

export const makeClickboundsTokens = (documents) =>
  documents
    .filter((x) => x.type === 'FRAME')
    .reduce(getChildren, [])
    .filter((x) => x.type === 'COMPONENT')
    .reduce(getChildren, [])
    .map((x) => {
      let name,
        value = ''
      try {
        name = formatName(x.name)
        value = pxString(x.absoluteBoundingBox.height)
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

const pxString = (unit) => `${unit}px`
