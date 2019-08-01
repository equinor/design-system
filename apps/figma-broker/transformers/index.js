import * as R from 'ramda'
import { withType, withName, instanceOfComponent, isNotNil } from '@utils'
import { px } from '@units'
import { fillToRgba } from './colors'

import { toTypography } from './typography'
import { toBorders } from './borders'
import { toSpacings } from './spacings'

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

export const toText = (figmaNode) => {
  const fill = figmaNode.fills.find(withType('solid')) || fallback

  return {
    color: fillToRgba(fill),
    typography: toTypography(figmaNode),
  }
}

export const toField = (figmaNode) => {
  const components = figmaNode.children
  const shape = R.find(instanceOfComponent('shape'), components)
  const spacings = R.filter(instanceOfComponent('spacing'), components)
  const clickbound = R.find(instanceOfComponent('clickbound'), components)
  const text = R.find(withType('text'), components)
  const border = R.filter(withName('border'), components)

  let height = ''
  let background = ''

  if (shape) {
    const component_ = R.head(shape.children)
    const fill = component_.fills.find(withType('solid')) || fallback

    height = px(component_.absoluteBoundingBox.height)
    background = fillToRgba(fill)
  }

  const transformations = {
    border: toBorders,
    text: toText,
    spacings: toSpacings,
    clickbound: (x) => toClickBound(x, height),
  }

  const data = {
    height,
    background,
    border,
    text,
    spacings,
    clickbound,
  }

  // We remove remove keys for undefined data and run transformations
  return R.evolve(transformations, R.pickBy(isNotNil, data))
}
