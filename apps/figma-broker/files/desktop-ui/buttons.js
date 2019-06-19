import { formatName, colortoRgba } from '@utils'
import * as R from 'ramda'
import { relative } from 'path'

const getChildren = (acc, x) => [...acc, ...x.children]

const componentId = ({ componentId }) => componentId

const getComponents = R.pipe(
  R.reduce(getChildren, []),
  R.groupBy(componentId),
  R.mapObjIndexed((comps, id) =>
    id === 'undefined' ? comps : R.mergeAll(comps),
  ),
)

const componentToProp = ([id, comps]) => {
  if (id === 'undefined') {
    // handles components without name
    const text = R.pipe(
      R.filter((x) => x.type === 'TEXT'),
      R.mergeAll,
      (x) => (R.isEmpty(x) ? { style: {} } : x),
    )(comps)

    const {
      fontPostScriptName,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeightPx,
    } = text.style

    return {
      typography: {
        font: fontPostScriptName,
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight: lineHeightPx,
      },
    }
  } else {
    const name = formatName(comps.name)

    if (R.test(/button/, name)) {
      const comp = comps.children[0]
      const fill = comp.fills.find((x) => x.type === 'SOLID')
      const stroke = comp.strokes.find((x) => x.type === 'SOLID')
      const { cornerRadius, strokeWeight } = comp

      return {
        cornerRadius,
        background: colortoRgba(fill.color),
        borderColor: stroke ? colortoRgba(stroke.color) : '',
        borderWidth: strokeWeight,
      }
    }
    // TODO: Get Fonda to fix spacing components, left & right spacer name would be best
    if (R.test(/space/, name)) {
      const { width } = comps.absoluteBoundingBox
      const { horizontal } = comps.constraints

      return { spacing: width }
    }
    // TODO: Get Fonda to fix naming
    if (R.test(/clickbound|standard/, name)) {
      const { height } = comps.absoluteBoundingBox
      return {
        clickbound: height,
      }
    }

    if (R.test(/focused/, name)) {
      const comp = comps.children[0]
      const fill = comp.fills.find((x) => x.type === 'SOLID')
      const stroke = comp.strokes.find((x) => x.type === 'SOLID')
      const { strokeDashes, strokeWeight } = comp
      // TODO: Figure out how to properly extract dashed border
      const focusStyle = typeof strokeDashes === 'undefined' ? '' : 'dashed'
      return {
        focusColor: stroke ? colortoRgba(stroke.color) : '',
        focusWidth: strokeWeight,
        focusStyle,
      }
    }

    if (R.test(/dots/, name)) {
      return {}
    }

    if (R.test(/hover-hand/, name)) {
      return {}
    }
    if (R.test(/placeholder/, name)) {
      return {}
    }

    console.log(`Missing clause: ${name}`)
  }
}

const fallback = {
  // color: { r: 1, g: 1, b: 1, a: 1 },
}

const buildProps = (states) => {
  let buttonProps = {}

  const pressed = states.find((x) => x.name === 'Pressed')
  const hovered = states.find((x) => x.name === 'Hover')
  const focused = states.find((x) => x.name === 'Focused')
  const loading = states.find((x) => x.name === 'Loading')
  const enabled = states.find((x) => x.name === 'Enabled')

  if (enabled) {
    const components = enabled.children
    const button = R.find((x) => x.name === 'Button', components)
    const label = R.find((x) => x.name === 'Label', components)
    const spacers = R.filter((x) => R.test(/Spacing/, x.name), components)

    if (button) {
      const button_ = button.children[0]
      const fill = button_.fills.find((x) => x.type === 'SOLID') || fallback
      const stroke = button_.strokes.find((x) => x.type === 'SOLID') || fallback
      const { cornerRadius, strokeWeight } = button_

      buttonProps = {
        ...buttonProps,
        cornerRadius,
        background: colortoRgba(fill.color),
        borderColor: colortoRgba(stroke.color),
        borderWidth: strokeWeight,
      }
    }

    if (label) {
      const {
        fontPostScriptName,
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeightPx,
      } = label.style

      buttonProps = {
        ...buttonProps,
        typography: {
          font: fontPostScriptName,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight: lineHeightPx,
        },
      }
    }

    if (spacers.length > 0) {
      console.log(spacers)
    }
  }

  if (focused) {
    const focus = R.find((x) => x.name === 'Focused', focused.children)

    if (focus) {
      const focus_ = focus.children[0]
      const stroke = focus_.strokes.find((x) => x.type === 'SOLID') || fallback
      const { strokeDashes, strokeWeight } = focus_
      const [dashWidth, dashGap] = strokeDashes
      const focusStyle = typeof strokeDashes === 'undefined' ? '' : 'dashed'

      buttonProps = {
        ...buttonProps,
        focusColor: colortoRgba(stroke.color),
        focusWidth: strokeWeight,
        focusStyle: {
          type: focusStyle,
          width: dashWidth,
          gap: dashGap,
        },
      }
    }
  }

  if (hovered) {
    const hover = R.find((x) => x.name === 'Button', hovered.children)

    if (hover) {
      const hover_ = hover.children[0]
      const fill = hover_.fills.find((x) => x.type === 'SOLID') || fallback

      buttonProps = {
        ...buttonProps,
        hoverBackground: colortoRgba(fill.color),
      }
    }
  }

  if (pressed) {
    const pressedOverlay = R.find(
      (x) => x.name === 'Pressed Overlay',
      pressed.children,
    )

    if (pressedOverlay) {
      const pressedOverlay_ = R.find(
        (x) => R.test(/Overlay/, x.name),
        pressedOverlay.children,
      ).children[0]

      const fill =
        pressedOverlay_.fills.find((x) => x.type === 'SOLID') || fallback
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
    .filter((x) => x.type === 'FRAME')
    .map((x) => {
      const states = x.children.filter((x) => x.type === 'COMPONENT')

      const name = formatName(x.name)
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
