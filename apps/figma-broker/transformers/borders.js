import * as R from 'ramda'
import { withType, propName } from '@utils'
import { px } from '@units'
import { fillToRgba } from './colors'

export const toBorder = (figmaNode) => {
  if (figmaNode.strokes.length === 0) return null
  const { cornerRadius, strokeWeight, strokes } = figmaNode
  const stroke = strokes.find(withType('solid')) || fallback
  return {
    outline: {
      color: fillToRgba(stroke),
      width: px(strokeWeight),
      radius: px(cornerRadius),
    },
  }
}

export const toBorders = (figmaNodes) => {
  // Figma does not support using border on select sides of a box,
  // so shape is used to show top, bottm, left or right borders
  return R.reduce(
    (acc, val) => {
      const { absoluteBoundingBox, cornerRadius, fills } = R.head(val.children)

      const [_, side] = R.match(/([\s\S]*?)(Border)/i, val.name)
      const side_ = propName(side)

      const fill = fills.find(withType('solid')) || fallback
      let border = {
        color: fillToRgba(fill),
        radius: px(cornerRadius) || 0,
        width: 0,
      }

      switch (side_) {
        case 'bottom':
        case 'top':
          border = {
            ...border,
            width: px(absoluteBoundingBox.height),
          }
          break

        case 'left':
        case 'right':
          border = {
            ...border,
            width: px(absoluteBoundingBox.width),
          }
          break

        default:
      }
      return {
        ...acc,
        [side_]: border,
      }
    },
    {},
    figmaNodes,
  )
}
