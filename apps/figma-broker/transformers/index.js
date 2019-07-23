import * as R from 'ramda'
import { withType } from '@utils'
import { px } from '@units'
import { fillToRgba } from './colors'

export { toTypography } from './typography'
export { fillToHex, fillToHsla, fillToRgba } from './colors'

const fallback = {}

export const toSpacer = (name, box) => {
  if (R.test(/Vertical/, name)) {
    return box.width
  }
  if (R.test(/Horizontal/, name)) {
    return box.height
  }
  return 0
}

export const toFocus = (figmaNode) => {
  const { strokeDashes } = figmaNode
  const [dashWidth, dashGap] = strokeDashes
  const stroke = figmaNode.strokes.find(withType('solid')) || fallback
  const focusStyle = typeof strokeDashes === 'undefined' ? '' : 'dashed'

  return {
    type: focusStyle,
    color: fillToRgba(stroke),
    width: px(dashWidth),
    gap: px(dashGap),
  }
}

export const toOverlay = (figmaNode) => {
  const fill = figmaNode.fills.find(withType('solid')) || fallback
  return {
    pressedColor: fillToRgba(fill),
  }
}
