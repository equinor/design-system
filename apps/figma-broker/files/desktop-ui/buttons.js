import * as R from 'ramda'
import {
  formatName,
  colortoRgba,
  getSpacingValue,
  withName,
  withType,
} from '@utils'

const fallback = {}

const rootFontSize = 16

const px = (unit) => `${unit}px`
const em = (unit) => `${unit}em`
const rem = (unit) => `${unit}rem`

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
        height: px(height),
        background: colortoRgba(fill.color),
        border: {
          color: colortoRgba(stroke.color),
          width: px(strokeWeight),
          radius: px(cornerRadius),
        },
      }
    }

    if (label) {
      const {
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing,
        textAlignHorizontal = 'center',
        lineHeightPercentFontSize,
      } = label.style
      const fill = label.fills.find(withType('solid')) || fallback

      const fontSizeRem = (fontSize / rootFontSize).toFixed(3)
      const lineHeightEm = (lineHeightPercentFontSize / 100).toFixed(3)
      const letterSpacingEm = (letterSpacing / fontSizeRem).toFixed(3)
      buttonProps = {
        ...buttonProps,
        color: colortoRgba(fill.color),
        typography: {
          fontFamily,
          fontSize: rem(fontSizeRem),
          fontWeight,
          letterSpacing: letterSpacing ? em(letterSpacingEm) : 0,
          lineHeight: em(lineHeightEm),
          textAlign: R.toLower(textAlignHorizontal),
        },
      }
    }

    if (spacing.length > 0) {
      // Spacing can be used in any form, so we create an object
      // with names prefixed with "Spacing" in figma´
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
              [name]: px(spacingValue),
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
      const clickboundOffset = (height - parseInt(buttonProps.height, 10)) / 2

      buttonProps = {
        ...buttonProps,
        clickbound: px(height),
        clickboundOffset: px(clickboundOffset),
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
          width: px(dashWidth),
          gap: px(dashGap),
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
    .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
