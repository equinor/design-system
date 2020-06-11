import R from 'ramda'
import {
  propName,
  withType,
  pickChildren,
  toDictDeep,
  mergeStrings,
} from '@utils'
import { toTypography } from '@transformers'

export const makeTextTokens = (typographies, getStyle) =>
  R.pipe(
    R.filter(withType('frame')),
    pickChildren,
    R.filter(withType('text')),
    R.map((node) => {
      let name
      let value = ''
      try {
        const style = getStyle(node.styles.text)
        name = propName(style.name)
        value = toTypography(node, name)
      } catch (error) {
        throw Error(`Error parsing typography for ${name}. ${error.message}`)
      }
      return {
        name,
        value,
      }
    }),
    toDictDeep,
  )(typographies)

// This is a duplicate from eds-core-react/common for now...
// TODO Do we need a common/util lib for all of eds?
const cssBody = (typography, link) => {
  let base = `  color: ${typography.color};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  line-height: ${typography.lineHeight};`

  const newline = `\n  `
  if (typography.fontStyle) {
    base += `${newline}font-style: ${typography.fontStyle};`
  }
  if (typography.letterSpacing) {
    base += `${newline}letter-spacing: ${typography.letterSpacing};`
  }
  if (typography.textTransform) {
    base += `${newline}text-transform: ${typography.textTransform};`
  }
  if (typography.textDecoration) {
    base += `${newline}text-decoration: ${typography.textDecoration};`
  }
  if (typography.fontFeature) {
    base += `${newline}font-feature-settings: ${typography.fontFeature};`
  }
  if (link) {
    base += `${newline}cursor: pointer;`
  }

  return base
}

const cssName = (group, name) => {
  switch (name) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'button':
    case 'label':
      return name
    case 'body_short':
      return 'p'
    case 'cell_header':
      return 'th'
    case 'cell_text':
      return 'table'
    case 'table_cell_text_link':
      return 'td a'
    // We choose numeric as text & numbers looks good with this
    case 'cell_numeric_monospaced':
      return 'td'
    case 'body_long_link':
      return 'a'
    default:
      return ``
  }
}

export const makeTypographyCss = (typography) => ({
  root: '  font-size:16px;\n  font-family: Equinor;\n',
  elements: R.pipe(
    R.mapObjIndexed((group, groupName) =>
      R.mapObjIndexed((typography, typographyName) => {
        const name = cssName(groupName, typographyName)

        return R.isEmpty(name) ? '' : `\n${name} {\n${cssBody(typography)}\n}`
      }, group),
    ),
    R.values,
    R.map(R.values),
    R.flatten,
    mergeStrings,
  )(typography),
})
