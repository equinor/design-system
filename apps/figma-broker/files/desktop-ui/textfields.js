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

const segment = (node) => {
  const { children } = node
  // Label
  const labels = R.find(withName('label'), children)
  const label = {
    label: R.find(withName('field'), labels.children),
    meta: R.find(withName('meta'), labels.children),
    spacings: R.filter(instanceOfComponent('spacing'), labels.children),
  }

  // Helper Text
  const helperTexts = R.filter(withName('helper'), children)
  const helperText = {}

  return removeNilAndEmpty({
    label,
    field: R.find(withName('field'), children),
    clickbound: R.find(instanceOfComponent('clickbound'), children),
    spacings: R.filter(instanceOfComponent('spacing'), children),
  })
}

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

  // data
  const data = removeNilAndEmpty({
    enabled: segment(enabled),
    active: segment(active),
    disabled: segment(disabled),
    focus: segment(focused),
    hover: segment(hovered),
    readOnly: segment(readOnly),
    danger: segment(danger),
    warning: segment(warning),
    success: segment(success),
  })

  const transformers = {
    label: {
      label: toText,
      meta: toText,
      spacings: toSpacings,
    },
    field: toField,
    clickbound: (x) => toClickBound(null, x),
    spacings: toSpacings,
    helperText: toText,
  }

  // transformations
  const transformations = {
    enabled: transformers,
    active: transformers,
    disabled: transformers,
    focus: transformers,
    hover: transformers,
    readOnly: transformers,
    danger: transformers,
    warning: transformers,
    success: transformers,
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
