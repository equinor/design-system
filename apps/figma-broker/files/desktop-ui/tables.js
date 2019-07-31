import * as R from 'ramda'
import { propName, withName, withType, toDict, pickChildren } from '@utils'
import { px } from '@units'
import {
  toTypography,
  toSpacer,
  toFocus,
  toOverlay,
  toBorders,
  toSpacings,
  fillToRgba,
} from '@transformers'

const fallback = {}

const head = R.pipe(
  R.defaultTo([]),
  R.head,
)

const buildProps = (states) => {
  let props = {}

  const enabled = R.find(withName('enabled'), states)
  const active = R.find(withName('active'), states)
  const disabled = R.find(withName('disabled'), states)
  const focused = R.find(withName('focus'), states)
  const hovered = R.find(withName('hover'), states)

  const pressed = R.find(withName('pressed'), states)
  const filled = R.find(withName('filled'), states)

  if (enabled || disabled) {
    const components = (enabled || disabled).children
    const component = R.find(withName('straight'), components)
    const label = R.find(withName('label'), components)

    const spacings = R.filter((x) => {
      const child = head(x.children) || { name: '' }

      return withName('spacing|spacer', child)
    }, components)
    const clickbounds = R.find(withName('clickbound'), components)
    const borders = R.filter(withName('border'), components)

    if (component) {
      const component_ = R.head(component.children)
      const fill = component_.fills.find(withType('solid')) || fallback

      props = {
        ...props,
        height: px(component_.absoluteBoundingBox.height),
        background: fillToRgba(fill),
      }
    }

    if (borders.length > 0) {
      const border = toBorders(borders)

      props = {
        ...props,
        border,
      }
    }

    if (label) {
      const fill = label.fills.find(withType('solid')) || fallback

      props = {
        ...props,
        color: fillToRgba(fill),
        typography: toTypography(label),
      }
    }

    if (spacings.length > 0) {
      props = {
        ...props,
        spacings: toSpacings(spacings),
      }
    }

    if (clickbounds) {
      const clickbound = R.head(clickbounds.children)
      const { height } = clickbound.absoluteBoundingBox
      const clickboundOffset = (height - parseInt(props.height, 10)) / 2

      props = {
        ...props,
        clickbound: px(height),
        clickboundOffset: px(clickboundOffset),
      }
    }
  }

  if (focused) {
    const focus = R.find(withName('focused'), focused.children)

    if (focus) {
      const focus_ = R.head(focus.children)
      props = {
        ...props,
        focus: toFocus(focus_),
      }
    }
  }

  if (hovered) {
    const hover = R.find(withName('straight'), hovered.children)

    if (hover) {
      const hover_ = R.head(hover.children)
      const fill = hover_.fills.find(withType('solid')) || fallback

      props = {
        ...props,
        hoverBackground: fillToRgba(fill),
      }
    }
  }

  if (pressed) {
    const pressedOverlay = R.find(withName('pressed overlay'), pressed.children)

    if (pressedOverlay) {
      const pressedOverlay_ = R.head(
        R.find(withName('overlay'), pressedOverlay.children).children,
      )

      props = {
        ...props,
        ...toOverlay(pressedOverlay_),
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
    console.log(`BUILD PROPS FOR: ${name}`)
    const tableProps = buildProps(states)
    console.log(`================================ \n`)

    return {
      name,
      value: tableProps,
    }
  }),
  toDict,
)
export const makeTablesComponent = (tables) => toTablesComponent(tables)
