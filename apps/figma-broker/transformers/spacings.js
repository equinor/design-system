import R from 'ramda'
import { propName } from '@utils'
import { px } from '@units'

export const toSpacings = (spacings) =>
  R.reduce(
    (acc, val) => {
      const { constraints, children, name } = val
      const { absoluteBoundingBox, name: childName } = R.head(children)
      const { horizontal, vertical } = constraints
      const name_ = propName(name).replace('spacing_', '')

      // Top or Bottom spacer
      if (R.test(/Horizontal/, childName)) {
        const spacing = px(absoluteBoundingBox.height)
        return {
          ...acc,
          [name_]: spacing,
        }
      }
      // Left or right spacer
      const spacing = px(absoluteBoundingBox.width)
      return {
        ...acc,
        [name_]: spacing,
      }
    },
    {},
    spacings,
  )
