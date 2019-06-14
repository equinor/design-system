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

export const makeButtonsComponent = (buttons) =>
  buttons
    .filter((x) => x.type === 'FRAME')
    .map((x) => {
      const states = x.children.filter((x) => x.type === 'COMPONENT')
      const components = getComponents(states)
      const buttonProps = R.pipe(
        R.toPairs,
        R.map(componentToProp),
        R.mergeAll,
      )(components)

      const name = formatName(x.name)

      return {
        name,
        value: buttonProps,
      }
    })
    .reduce((acc, { name, value }) => {
      acc[name] = value
      return acc
    }, {})
