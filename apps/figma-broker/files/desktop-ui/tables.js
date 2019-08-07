import * as R from 'ramda'
import {
  propName,
  withName,
  withType,
  toDict,
  instanceOfComponent,
  isNotNil,
} from '@utils'
import {
  toBorders,
  toClickBound,
  toFocus,
  toHover,
  toSpacings,
  toText as toText_,
  toField as toField_,
  toShape,
} from '@transformers'

const fallback = {}

const buildProps = (states, getStyle) => {
  // states
  const enabled = R.find(withName('enabled'), states)
  const active = R.find(withName('active'), states)
  const disabled = R.find(withName('disabled'), states)
  const focused = R.find(withName('focus'), states)
  const hovered = R.find(withName('hover'), states)
  const filled = R.find(withName('filled'), states)

  // functions
  const removeNil = R.curry(R.pickBy)(isNotNil)
  const toText = R.curry(toText_)(getStyle)
  const toField = R.curry(toField_)(getStyle)

  // pre transformed data
  const shape = toShape(R.find(instanceOfComponent('shape'), enabled.children))
  const activeShape = toShape(
    R.find(instanceOfComponent('shape'), active.children),
  )
  const disabledShape = toShape(
    R.find(instanceOfComponent('shape'), disabled.children),
  )
  const activeLabel = toText(R.find(withName('label'), active.children))
  const disabledLabel = toText(R.find(withName('label'), disabled.children))

  const focus = toFocus(
    R.find(instanceOfComponent('focused'), focused.children),
  )
  const hover = toHover(R.find(withName('straight'), hovered.children))

  // data
  const data = removeNil({
    ...shape,
    borders: R.filter(withName('border'), enabled.children),
    text: R.find(withType('text'), enabled.children),
    spacings: R.filter(instanceOfComponent('spacing'), enabled.children),
    clickbound: R.find(instanceOfComponent('clickbound'), enabled.children),
    field: R.find(withName('field'), enabled.children),
    active: removeNil({
      background: activeShape.background,
      ...activeLabel,
      borders: R.filter(withName('border'), active.children),
      field: R.find(withName('field'), active.children),
    }),
    disabled: removeNil({
      background: disabledShape.background,
      ...disabledLabel,
      borders: R.filter(withName('border'), disabled.children),
      field: R.find(withName('field'), disabled.children),
    }),
    focus: removeNil({
      ...focus,
      field: R.find(withName('field'), focused.children),
    }),
    hover: removeNil({
      ...hover,
      field: R.find(withName('field'), hovered.children),
    }),
  })

  // transformations
  const transformations = {
    borders: toBorders,
    text: toText,
    spacings: toSpacings,
    clickbound: (x) => toClickBound(shape.height, x),
    field: toField,
    active: {
      borders: toBorders,
      field: toField,
    },
    disabled: {
      borders: toBorders,
      field: toField,
    },
    focus: {
      field: toField,
    },
    hover: {
      field: toField,
    },
  }

  return R.evolve(transformations, data)
}

export const makeTablesComponent = (tables, getStyle) =>
  R.pipe(
    R.filter(withType('frame')),
    R.map((node) => {
      const name = propName(node.name)
      const states = R.filter(withType('component'), node.children)
      const tableProps = buildProps(states, getStyle)

      return {
        name,
        value: tableProps,
      }
    }),
    toDict,
  )(tables)
