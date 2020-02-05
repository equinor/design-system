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

export const spacingsTemplate = (spacings) => `
padding-left: ${spacings.left};
padding-right: ${spacings.right};
padding-top: ${spacings.top};
padding-bottom: ${spacings.bottom};
`

export const positionTemplate = ({ position }) => {
  const base = `position: ${position}`

  if (!position) {
    return ''
  }
  if (position === 'fixed') {
    return `
    ${base}
    top:0;
    left: 0;
    right:0;`
  }
  if (position === 'sticky') {
    return `
    ${base}
    top:0;`
  }

  return base
}
