export const typographyTemplate = (typography, link) => {
  let base = `
  margin: 0;
  color: ${typography.color};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  line-height: ${typography.lineHeight};
  `

  if (typography.fontStyle) {
    base = base + `font-style: ${typography.fontStyle};`
  }
  if (typography.letterSpacing) {
    base = base + `letter-spacing: ${typography.letterSpacing};`
  }
  if (typography.textTransform) {
    base = base + `text-transform: ${typography.textTransform};`
  }
  if (typography.textDecoration) {
    base = base + `text-decoration: ${typography.textDecoration};`
  }
  if (typography.fontFeature) {
    base = base + ` font-feature-settings: ${typography.fontFeature};`
  }
  if (link) {
    base = base + 'cursor: pointer;'
  }

  return base
}
