import * as R from 'ramda'
import { withType, propName } from '@utils'
import { px } from '@units'
import { fillToRgba } from './colors'

export * from './typography'
export * from './colors'
export * from './borders'
export * from './spacings'

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
  const focus = R.head(figmaNode.children)
  const { strokeDashes, strokes } = focus
  const stroke = strokes.find(withType('solid')) || fallback
  const [dashWidth, dashGap] = strokeDashes
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

export const toClickBound = (figmaNode, componentHeight) => {
  const clickbound = R.head(figmaNode.children)
  const { height } = clickbound.absoluteBoundingBox
  const offset = (height - parseInt(componentHeight, 10)) / 2

  return { height: px(height), offset: px(offset) }
}

export const toHover = (figmaNode) => {
  const hover = R.head(figmaNode.children)
  const fill = hover.fills.find(withType('solid')) || fallback

  return {
    background: fillToRgba(fill),
  }
}

export const toActive = (figmaNode) => {}
