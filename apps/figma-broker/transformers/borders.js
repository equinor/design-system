import * as R from 'ramda'
import { withType, propName } from '@utils'
import { px } from '@units'
import { fillToRgba } from './colors'
import { isNotEmpty } from '../functions/utils'

const fallback = {}

export const toBorder = (figmaNode) => {
  if (figmaNode.strokes.length === 0) return null
  const { cornerRadius, strokeWeight, strokes } = figmaNode
  const stroke = strokes.find(withType('solid')) || fallback
  return {
    color: fillToRgba(stroke),
    width: px(strokeWeight),
    radius: px(cornerRadius),
  }
}

export const toBorders = (figmaNodes) => {
  // Figma does not support using border on select sides of a box,
  // so shape is used to show top, bottm, left or right borders

  // Also sometimes a box is used WITH full borders
  return R.reduce(
    (acc, val) => {
      const node = R.isNil(val.children) ? val : R.head(val.children)
      const { absoluteBoundingBox, cornerRadius, fills, strokes } = node
      const isUSingStrokes = isNotEmpty(strokes)
      const strokesBorder = toBorder(node)

      const match = R.pipe(
        R.match(/(?<=border).*/gi),
        R.head,
        R.defaultTo(''),
        R.trim,
      )(val.name)

      const side = R.isEmpty(match) ? 'outline' : propName(match)

      const fill = fills.find(withType('solid')) || fallback
      let border = {
        color: isUSingStrokes ? strokesBorder.color : fillToRgba(fill),
        radius: isUSingStrokes ? strokesBorder.radius : px(cornerRadius) || 0,
        width: isUSingStrokes ? strokesBorder.width : 0,
      }

      switch (side) {
        case 'bottom':
        case 'top':
          border = {
            ...border,
            width: isUSingStrokes
              ? strokesBorder.width
              : px(absoluteBoundingBox.height),
          }
          break

        case 'left':
        case 'right':
          border = {
            ...border,
            width: isUSingStrokes
              ? strokesBorder.width
              : px(absoluteBoundingBox.width),
          }
          break

        default:
      }
      return {
        ...acc,
        [side]: border,
      }
    },
    {},
    figmaNodes,
  )
}
