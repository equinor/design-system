import * as R from 'ramda'
import {
  propName,
  withName,
  withType,
  instanceOfComponent,
  isNotEmpty,
} from '@utils'
import { px } from '@units'
import {
  toTypography,
  toSpacings,
  toFocus,
  toOverlay,
  toHover,
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
    let ghostIcon = null
    if (!button) {
      if (R.isNil(hovered)) {
        // disabled
        ghostIcon = R.find(withName('icon'), components)
      } else {
        // other variants
        ghostIcon = R.find(instanceOfComponent('shape'), hovered.children)
      }
    }

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

    if (ghostIcon) {
      const icon_ = R.last(ghostIcon.children)
      const { cornerRadius, strokeWeight, absoluteBoundingBox } = icon_
      const { height, width } = absoluteBoundingBox
      const fill = icon_.fills.find(withType('solid')) || fallback
      const stroke = icon_.strokes.find(withType('solid')) || fallback
      const radius = cornerRadius === 100 ? '50%' : px(cornerRadius)

      buttonProps = {
        ...buttonProps,
        height: px(height),
        width: px(width),
        color: fillToRgba(fill),
        background: 'transparent',
        border: {
          color: fillToRgba(stroke),
          width: px(strokeWeight),
          radius,
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
      buttonProps = {
        ...buttonProps,
        hover: toHover(hover),
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
