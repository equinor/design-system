import R from 'ramda'
import {
  propName,
  withName,
  withType,
  instanceOfComponent,
  removeNilAndEmpty,
  toDictDeep,
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

const getLabelNode = (children) => {
  let textNode = R.find(withType('text'), children)

  // Find label in Auto-Layout node
  if (R.isNil(textNode)) {
    textNode = R.pipe(
      R.find(withName('contents')),
      R.prop('children'),
      R.defaultTo([]),
      R.find(withName('label')),
      R.prop('children'),
      R.defaultTo([]),
      R.find(withType('text')),
    )(children)
  }
  return textNode
}

const buildProps = (states, getStyle) => {
  // states
  const enabled = R.find(withName('enabled'), states)
  const active = R.find(withName('active'), states)
  const disabled = R.find(withName('disabled'), states)
  const focused = R.find(withName('focus'), states)
  const hovered = R.find(withName('hover'), states)
  const filled = R.find(withName('filled'), states) || { children: [] }

  // functions
  const toText = R.curry(toText_)(getStyle)
  const toField = R.curry(toField_)(getStyle)(
    R.find(withName('field'), filled.children),
  )

  // pre transformed data
  const shape = toShape(R.find(instanceOfComponent('shape'), enabled.children))
  const activeShape = toShape(
    R.find(instanceOfComponent('shape'), active.children),
  )
  const disabledShape = toShape(
    R.find(instanceOfComponent('shape'), disabled.children),
  )
  const enabledLabel = toText(getLabelNode(enabled.children))
  const activeLabel = toText(getLabelNode(active.children))
  const disabledLabel = toText(getLabelNode(disabled.children))

  const focus = toFocus(
    R.find(instanceOfComponent('focused'), focused.children),
  )
  const hover = toHover(R.find(withName('straight'), hovered.children))

  // data
  const data = removeNilAndEmpty({
    ...shape,
    borders: R.filter(withName('border'), enabled.children),
    text: enabledLabel,
    spacings: R.filter(instanceOfComponent('spacing'), enabled.children),
    clickbound: R.find(instanceOfComponent('clickbound'), enabled.children),
    field: R.find(withName('field'), enabled.children),
    active: removeNilAndEmpty({
      background: activeShape.background,
      ...activeLabel,
      borders: R.filter(withName('border'), active.children),
      field: R.find(withName('field'), active.children),
    }),
    disabled: removeNilAndEmpty({
      background: disabledShape.background,
      ...disabledLabel,
      borders: R.filter(withName('border'), disabled.children),
      field: R.find(withName('field'), disabled.children),
    }),
    focus: removeNilAndEmpty({
      ...focus,
      field: R.find(withName('field'), focused.children),
    }),
    hover: removeNilAndEmpty({
      ...hover,
      field: R.find(withName('field'), hovered.children),
    }),
  })

  // transformations
  const transformations = {
    borders: toBorders,
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
    toDictDeep,
  )(tables)
