import * as R from 'ramda'
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

export const makeTypographyCss = (typography) => ({
  root: '  font-size:16px;\n',
  classes: R.pipe(
    R.mapObjIndexed((group, groupName) =>
      R.mapObjIndexed(
        (typography, typographyName) =>
          `\n.${groupName}_${typographyName}{\n${typographyTemplate(
            typography,
          )}\n}`,
        group,
      ),
    ),
    R.values,
    R.map(R.values),
    R.flatten,
    mergeStrings,
  )(typography),
})

// This is a duplicate from eds-core-react/common for now...
// TODO Do we need a common/util lib for all of eds?
export const typographyTemplate = (typography, link) => {
  let base = `  color: ${typography.color};
  font-family: ${typography.fontFamily};
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
