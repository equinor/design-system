import * as R from 'ramda'
import { withType, removeNilAndEmpty } from '../functions/utils'
import { px } from '../functions/units'
import { fillToRgba } from './colors'

export * from './typography'
export * from './colors'

const fallback = {}

export const toFocus = (figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const focus = Array.isArray(figmaNode.children)
    ? R.head(figmaNode.children)
    : figmaNode
  const { strokeDashes, strokes } = focus
  const stroke = strokes.find(withType('solid')) || fallback
  const [dashWidth] = strokeDashes
  const style = typeof strokeDashes === 'undefined' ? '' : 'dashed'

  return removeNilAndEmpty({
    style,
    color: fillToRgba(stroke),
    width: px(dashWidth),
  })
}

export const toOverlay = (figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const { fills, blendMode } = figmaNode
  const fill = fills.find(withType('solid')) || fallback
  return {
    blendMode: R.toLower(blendMode),
    pressedColor: fillToRgba(fill),
  }
}

export const toShape = (figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const shape = R.head(figmaNode.children)
  const fill = shape.fills.find(withType('solid')) || fallback

  return {
    height: px(shape.absoluteBoundingBox.height),
    background: fillToRgba(fill),
  }
}

export const toCSSVars = (items) =>
  `${items.reduce(
    (acc, { name, value }) => `${acc}  --${name}: ${value};\n`,
    '',
  )}\n`
