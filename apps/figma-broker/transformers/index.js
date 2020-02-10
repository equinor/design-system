import * as R from 'ramda'
import {
  withType,
  withName,
  instanceOfComponent,
  removeNilAndEmpty,
} from '@utils'
import { px } from '@units'
import { fillToRgba } from './colors'

import { toTypography } from './typography'
import { toBorders } from './borders'
import { toSpacings } from './spacings'
import { isNotEmpty } from '../functions/utils'

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
  const { strokeDashes, strokes, cornerRadius } = focus
  const stroke = strokes.find(withType('solid')) || fallback
  const [dashWidth, dashGap] = strokeDashes
  const focusStyle = typeof strokeDashes === 'undefined' ? '' : 'dashed'

  return removeNilAndEmpty({
    type: focusStyle,
    color: fillToRgba(stroke),
    width: px(dashWidth),
    gap: px(dashGap),
    radius: px(cornerRadius),
  })
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
  const { height, width } = clickbound.absoluteBoundingBox
  const offset = (height - parseInt(componentHeight, 10)) / 2

  return { height: px(height), width: px(width), offset: px(offset) }
}

export const toHover = (figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const hover = R.head(figmaNode.children)
  const { fills, cornerRadius } = hover
  const fill = fills.find(withType('solid')) || fallback
  // Figma can only use pixel as radius for shapes. 100 pixel is used for circle shapes
  const radius = cornerRadius === 100 ? '50%' : px(cornerRadius)
  return removeNilAndEmpty({
    background: fillToRgba(fill),
    radius,
  })
}

export const toActive = (figmaNode) => {}

export const toText = (getStyle, figmaNode) => {
  let node = figmaNode
  if (R.isNil(node)) return {}

  if (node.type === 'GROUP') {
    node = R.find(withName('label'), node.children)
  }

  if (R.isNil(figmaNode.fills)) {
    console.log('no fills!')
  }
  const fill = (node.fills || []).find(withType('solid')) || fallback
  const { name } = getStyle(node.styles.text)

  return removeNilAndEmpty({
    color: fillToRgba(fill),
    typography: toTypography(node, name),
  })
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

export const toField = (getStyle, filledNode, enabledNode) => {
  if (R.isNil(enabledNode)) return {}

  const components = enabledNode.children || []
  const filledComponents = filledNode.children || []
  const shape = R.find(instanceOfComponent('shape'), components)
  const shape_ = toShape(shape)
  const borders = R.filter(withName('border'), components)

  const hasNoBorders = R.isEmpty(borders)
  let text = toText(getStyle, R.find(withType('text'), components))
  const filledText = toText(
    getStyle,
    R.find(withType('text'), filledComponents),
  )

  if (isNotEmpty(filledText)) {
    text = {
      ...text,
      color: filledText.color,
      colorPlaceholder: text.color,
    }
  }
  const borderData = hasNoBorders ? [shape] : borders

  if (R.isEmpty(borderData)) {
    console.log('no borders')
  }
  const data = {
    ...shape_,
    borders: borderData,
    text,
    spacings: R.filter(instanceOfComponent('spacing'), components),
    clickbound: R.find(instanceOfComponent('clickbound'), components),
  }

  const transformations = {
    borders: toBorders,
    spacings: toSpacings,
    clickbound: (x) => toClickBound(shape_.height, x),
  }

  // We remove remove keys with undefined data before running transformations
  return R.evolve(transformations, removeNilAndEmpty(data))
}

export const toIcon = (figmaNode) => {
  if (R.isNil(figmaNode)) return {}

  const icon = R.head(R.tail(figmaNode.children))
  // const icon = R.find(instanceOfComponent('icon'), group.children)
  const fill = icon.fills.find(withType('solid')) || fallback

  return {
    height: px(icon.absoluteBoundingBox.height),
    width: px(icon.absoluteBoundingBox.width),
    color: fillToRgba(fill),
  }
}

export const toCSSVars = (items) =>
  `${items.reduce(
    (acc, { name, value }) => `${acc}  --${name}: ${value};\n`,
    '',
  )}\n`
