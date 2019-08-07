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
  if (R.isNil(figmaNode)) return {}

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
  if (R.isNil(figmaNode)) return {}

  const fill = figmaNode.fills.find(withType('solid')) || fallback
  return {
    pressedColor: fillToRgba(fill),
  }
}

export const toClickBound = (componentHeight, figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const clickbound = R.head(figmaNode.children)
  const { height } = clickbound.absoluteBoundingBox
  const offset = (height - parseInt(componentHeight, 10)) / 2

  return { height: px(height), offset: px(offset) }
}

export const toHover = (figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const hover = R.head(figmaNode.children)
  const fill = hover.fills.find(withType('solid')) || fallback

  return {
    background: fillToRgba(fill),
  }
}

export const toActive = (figmaNode) => {}

export const toText = (getStyle, figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const fill = figmaNode.fills.find(withType('solid')) || fallback
  const { name } = getStyle(figmaNode.styles.text)

  return {
    color: fillToRgba(fill),
    typography: toTypography(figmaNode, name),
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

export const toField = (getStyle, figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const components = figmaNode.children
  const shape = toShape(R.find(instanceOfComponent('shape'), components))

  const data = {
    ...shape,
    borders: R.filter(withName('border'), components),
    text: R.find(withType('text'), components),
    spacings: R.filter(instanceOfComponent('spacing'), components),
    clickbound: R.find(instanceOfComponent('clickbound'), components),
  }

  const transformations = {
    borders: toBorders,
    text: (x) => toText(getStyle, x),
    spacings: toSpacings,
    clickbound: (x) => toClickBound(shape.height, x),
  }

  // We remove remove keys with undefined data before running transformations
  return R.evolve(transformations, R.pickBy(isNotNil, data))
}
