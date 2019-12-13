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
    base += `\nfont-style: ${typography.fontStyle};`
  }
  if (typography.letterSpacing) {
    base += `\nletter-spacing: ${typography.letterSpacing};`
  }
  if (typography.textTransform) {
    base += `\ntext-transform: ${typography.textTransform};`
  }
  if (typography.textDecoration) {
    base += `\ntext-decoration: ${typography.textDecoration};`
  }
  if (typography.fontFeature) {
    base += `\nfont-feature-settings: ${typography.fontFeature};`
  }
  if (link) {
    base += `\ncursor: pointer;`
  }

  return base
}
