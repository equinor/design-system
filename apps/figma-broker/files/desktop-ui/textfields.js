import * as R from 'ramda'
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

const buildProps = (states, getStyle) => {
  // states
  const enabled = R.find(withName('enabled'), states)
  const active = R.find(withName('active'), states)
  const disabled = R.find(withName('disabled'), states)
  const focused = R.find(withName('focus'), states)
  const hovered = R.find(withName('hover'), states)
  const filled = R.find(withName('filled'), states) || { children: [] }
  const readOnly = R.find(withName('read only'), states) || { children: [] }
  const danger = R.find(withName('danger'), states) || { children: [] }
  const warning = R.find(withName('warning'), states) || { children: [] }
  const success = R.find(withName('success'), states) || { children: [] }

  // functions
  const toText = R.curry(toText_)(getStyle)
  const toField = R.curry(toField_)(getStyle)(
    R.find(withName('field'), filled.children),
  )

  // pre transformed data
  const activeLabel = toText(R.find(withName('label'), active.children))
  const disabledLabel = toText(R.find(withName('label'), disabled.children))

  // data
  const data = removeNilAndEmpty({
    borders: R.filter(withName('border'), enabled.children),
    text: toText(R.find(withType('text'), enabled.children)),
    spacings: R.filter(instanceOfComponent('spacing'), enabled.children),
    field: R.find(withName('field'), enabled.children),
    clickbound: R.find(instanceOfComponent('clickbound'), enabled.children),

    active: removeNilAndEmpty({
      ...activeLabel,
      field: R.find(withName('field'), active.children),
    }),
    disabled: removeNilAndEmpty({
      ...disabledLabel,
      field: R.find(withName('field'), disabled.children),
    }),
    focus: removeNilAndEmpty({
      field: R.find(withName('field'), focused.children),
    }),
    hover: removeNilAndEmpty({
      field: R.find(withName('field'), hovered.children),
    }),
    readOnly: removeNilAndEmpty({}),
  })

  // transformations
  const transformations = {
    borders: toBorders,
    spacings: toSpacings,
    field: toField,
    clickbound: (x) => toClickBound(null, x),

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

export const makeTextfieldsComponent = (tables, getStyle) =>
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
