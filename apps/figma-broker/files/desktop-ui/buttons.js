import {
  formatName,
  colortoRgba,
  getSpacingValue,
  withName,
  withType,
} from '@utils'
import * as R from 'ramda'

const fallback = {}

const buildProps = (states) => {
  let buttonProps = {}

  const pressed = R.find(withName('pressed'), states)
  const hovered = R.find(withName('hover'), states)
  const focused = R.find(withName('focused'), states)
  const enabled = R.find(withName('enabled'), states)
  const disabled = R.find(withName('disabled'), states)

  if (enabled || disabled) {
    const components = (enabled || disabled).children
    const button = R.find(withName('button'), components)
    const label = R.find(withName('label'), components)
    const spacing = R.filter(withName('spacing'), components)
    const clickbounds = R.find(withName('clickbounds'), components)

    if (button) {
      const button_ = R.head(button.children)
      const { cornerRadius, strokeWeight, absoluteBoundingBox } = button_
      const { height } = absoluteBoundingBox
      const fill = button_.fills.find(withType('solid')) || fallback
      const stroke = button_.strokes.find(withType('solid')) || fallback

      buttonProps = {
        ...buttonProps,
        height,
        background: colortoRgba(fill.color),
        border: {
          color: colortoRgba(stroke.color),
          width: strokeWeight,
          radius: cornerRadius,
        },
      }
    }

    if (label) {
      const {
        fontPostScriptName,
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeightPx,
        textAlignHorizontal = 'center',
      } = label.style
      const fill = label.fills.find(withType('solid')) || fallback

      buttonProps = {
        ...buttonProps,
        color: colortoRgba(fill.color),
        typography: {
          font: fontPostScriptName,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight: lineHeightPx,
          textAlign: R.toLower(textAlignHorizontal),
        },
      }
    }

    if (spacing.length > 0) {
      // Spacing can be used in any form, so we create an object
      // with names prefixed with "Spacing" in figma
      const spacingProps = R.reduce(
        (acc, val) => {
          const spacer = R.head(val.children)
          if (spacer) {
            const name = R.head(R.match(/(?<=Spacing\s).*/i, val.name))
            const spacingValue = getSpacingValue(
              spacer.name,
              spacer.absoluteBoundingBox,
            )
            return {
              ...acc,
              [name]: spacingValue,
            }
          }
          return acc
        },
        {},
        spacing,
      )

      buttonProps = {
        ...buttonProps,
        spacing: spacingProps,
      }
    }

    if (clickbounds) {
      const clickbound = R.head(clickbounds.children)
      const { height } = clickbound.absoluteBoundingBox

      buttonProps = {
        ...buttonProps,
        clickbound: height,
      }
    }
  }

  if (focused) {
    const focus = R.find(withName('focused'), focused.children)

    if (focus) {
      const focus_ = R.head(focus.children)
      const { strokeDashes } = focus_
      const [dashWidth, dashGap] = strokeDashes
      const stroke = focus_.strokes.find(withType('solid')) || fallback
      const focusStyle = typeof strokeDashes === 'undefined' ? '' : 'dashed'

      buttonProps = {
        ...buttonProps,
        focus: {
          type: focusStyle,
          color: colortoRgba(stroke.color),
          width: dashWidth,
          gap: dashGap,
        },
      }
    }
  }

  if (hovered) {
    const hover = R.find(withName('button'), hovered.children)

    if (hover) {
      const hover_ = R.head(hover.children)
      const fill = hover_.fills.find(withType('solid')) || fallback

      buttonProps = {
        ...buttonProps,
        hoverBackground: colortoRgba(fill.color),
      }
    }
  }

  if (pressed) {
    const pressedOverlay = R.find(withName('pressed overlay'), pressed.children)

    if (pressedOverlay) {
      const pressedOverlay_ = R.head(
        R.find(withName('overlay'), pressedOverlay.children).children,
      )
      const fill = pressedOverlay_.fills.find(withType('solid')) || fallback
      const opacity = Math.round(fill.opacity * 100) / 100

      buttonProps = {
        ...buttonProps,
        pressedColor: colortoRgba(fill.color),
        pressedOpacity: opacity,
      }
    }
  }

  return buttonProps
}

export const makeButtonsComponent = (buttons) =>
  buttons
    .filter(withType('frame'))
    .map((node) => {
      const name = formatName(node.name)
      const states = R.filter(withType('component'), node.children)
      const buttonProps = buildProps(states)

      return {
        name,
        value: buttonProps,
      }
    })
    .reduce((acc, { name, value }) => {
      acc[name] = value
      return acc
    }, {})
