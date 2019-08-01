import * as R from 'ramda'
import {
  propName,
  withName,
  withType,
  toDict,
  instanceOfComponent,
} from '@utils'
import { px } from '@units'
import {
  fillToRgba,
  toBorders,
  toClickBound,
  toFocus,
  toHover,
  toOverlay,
  toSpacings,
  toText,
  toField,
  toTypography,
} from '@transformers'

const fallback = {}

const buildProps = (states) => {
  let props = {}

  const enabled = R.find(withName('enabled'), states)
  const active = R.find(withName('active'), states)
  const disabled = R.find(withName('disabled'), states)
  const focused = R.find(withName('focus'), states)
  const hovered = R.find(withName('hover'), states)

  const filled = R.find(withName('filled'), states)

  if (enabled || disabled) {
    const components = (enabled || disabled).children

    const shape = R.find(instanceOfComponent('shape'), components)
    const spacings = R.filter(instanceOfComponent('spacing'), components)
    const clickbound = R.find(instanceOfComponent('clickbound'), components)
    const text = R.find(withType('text'), components)
    const field = R.find(withName('field'), components)
    const borders = R.filter(withName('border'), components)

    if (shape) {
      const component_ = R.head(shape.children)
      const fill = component_.fills.find(withType('solid')) || fallback

      props = {
        ...props,
        height: px(component_.absoluteBoundingBox.height),
        background: fillToRgba(fill),
      }
    }

    if (borders.length > 0) {
      props = {
        ...props,
        border: toBorders(borders),
      }
    }

    if (text) {
      props = {
        ...props,
        text: toText(text),
      }
    }

    if (field) {
      props = {
        ...props,
        field: toField(field),
      }
    }

    if (spacings.length > 0) {
      props = {
        ...props,
        spacings: toSpacings(spacings),
      }
    }

    if (clickbound) {
      props = {
        ...props,
        clickbound: toClickBound(clickbound, props.height),
      }
    }
  }

  if (active) {
    const components = active.children
    const shape = R.find(withName('straight'), components)
    const label = R.find(withName('label'), components)
    const borders = R.filter(withName('border'), components)

    let active_ = {}
    if (shape) {
      const component_ = R.head(shape.children)
      const fill = component_.fills.find(withType('solid')) || fallback

      active_ = {
        ...active_,
        background: fillToRgba(fill),
      }
    }

    if (borders.length > 0) {
      active_ = {
        ...active_,
        border: toBorders(borders),
      }
    }

    if (label) {
      const fill = label.fills.find(withType('solid')) || fallback

      active_ = {
        ...active_,
        color: fillToRgba(fill),
        typography: toTypography(label),
      }
    }

    props = {
      ...props,
      active: active_,
    }
  }

  if (disabled) {
    const components = disabled.children
    const shape = R.find(withName('straight'), components)
    const label = R.find(withName('label'), components)
    const borders = R.filter(withName('border'), components)

    let disabled_ = {}
    if (shape) {
      const component_ = R.head(shape.children)
      const fill = component_.fills.find(withType('solid')) || fallback

      disabled_ = {
        ...disabled_,
        background: fillToRgba(fill),
      }
    }

    if (borders.length > 0) {
      disabled_ = {
        ...disabled_,
        border: toBorders(borders),
      }
    }

    if (label) {
      const fill = label.fills.find(withType('solid')) || fallback

      disabled_ = {
        ...disabled_,
        color: fillToRgba(fill),
        typography: toTypography(label),
      }
    }

    props = {
      ...props,
      disabled: disabled_,
    }
  }

  if (focused) {
    const focus = R.find(instanceOfComponent('focused'), focused.children)

    if (focus) {
      props = {
        ...props,
        focus: toFocus(focus),
      }
    }
  }

  if (hovered) {
    const hover = R.find(withName('straight'), hovered.children)

    if (hover) {
      props = {
        ...props,
        hover: toHover(hover),
      }
    }
  }

  return props
}

const toTablesComponent = R.pipe(
  R.filter(withType('frame')),
  R.map((node) => {
    const name = propName(node.name)
    const states = R.filter(withType('component'), node.children)
    const tableProps = buildProps(states)

    return {
      name,
      value: tableProps,
    }
  }),
  toDict,
)
export const makeTablesComponent = (tables) => toTablesComponent(tables)
