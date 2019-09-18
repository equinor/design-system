import * as R from 'ramda'
import { propName, withName, withType, instanceOfComponent } from '@utils'
import { px } from '@units'
import {
  toTypography,
  toSpacings,
  toFocus,
  toOverlay,
  fillToRgba,
} from '@transformers'

const fallback = {}

const buildProps = (states) => {
  let buttonProps = {}

  const pressed = R.find(withName('pressed'), states)
  const hovered = R.find(withName('hover'), states)
  const focused = R.find(withName('focus'), states)
  const enabled = R.find(withName('enabled'), states)
  const disabled = R.find(withName('disabled'), states)

  if (enabled || disabled) {
    const components = (enabled || disabled).children
    const button = R.find(instanceOfComponent('shape'), components)
    const label = R.find(withName('label'), components)
    const spacing = R.filter(instanceOfComponent('spacing'), components)
    const clickbounds = R.find(instanceOfComponent('clickbound'), components)

    if (button) {
      const button_ = R.head(button.children)
      const { cornerRadius, strokeWeight, absoluteBoundingBox } = button_
      const { height } = absoluteBoundingBox
      const fill = button_.fills.find(withType('solid')) || fallback
      const stroke = button_.strokes.find(withType('solid')) || fallback

      buttonProps = {
        ...buttonProps,
        height: px(height),
        background: fillToRgba(fill),
        border: {
          color: fillToRgba(stroke),
          width: px(strokeWeight),
          radius: px(cornerRadius),
        },
      }
    }

    if (label) {
      const fill = label.fills.find(withType('solid')) || fallback

      buttonProps = {
        ...buttonProps,
        color: fillToRgba(fill),
        typography: toTypography(label),
      }
    }

    if (spacing.length > 0) {
      buttonProps = {
        ...buttonProps,
        spacing: toSpacings(spacing),
      }
    }

    if (clickbounds) {
      const clickbound = R.head(clickbounds.children)
      const { height } = clickbound.absoluteBoundingBox
      const clickboundOffset = (height - parseInt(buttonProps.height, 10)) / 2

      buttonProps = {
        ...buttonProps,
        clickbound: px(height),
        clickboundOffset: px(clickboundOffset),
      }
    }
  }

  if (focused) {
    const focus = R.find(instanceOfComponent('focused'), focused.children)

    if (focus) {
      const focus_ = R.head(focus.children)
      buttonProps = {
        ...buttonProps,
        focus: toFocus(focus),
      }
    }
  }

  if (hovered) {
    const hover = R.find(instanceOfComponent('shape'), hovered.children)

    if (hover) {
      const hover_ = R.head(hover.children)
      const fill = hover_.fills.find(withType('solid')) || fallback

      buttonProps = {
        ...buttonProps,
        hoverBackground: fillToRgba(fill),
      }
    }
  }

  if (pressed) {
    const pressedOverlay = R.find(withName('pressed overlay'), pressed.children)

    if (pressedOverlay) {
      const pressedOverlay_ = R.head(
        R.find(instanceOfComponent('pressed'), pressedOverlay.children)
          .children,
      )

      buttonProps = {
        ...buttonProps,
        ...toOverlay(pressedOverlay_),
      }
    }
  }

  return buttonProps
}

export const makeButtonsComponent = (buttons) =>
  buttons
    .filter(withType('frame'))
    .map((node) => {
      const name = propName(node.name)
      const states = R.filter(withType('component'), node.children)
      const buttonProps = buildProps(states)

      return {
        name,
        value: buttonProps,
      }
    })
    .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
