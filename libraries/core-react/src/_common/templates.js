export const typographyTemplate = (typography, link) => {
  let base = `
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

export const borderTemplate = (borders) => {
  const { outline } = borders
  if (outline) {
    return `outline: ${outline.width} solid ${outline.color};`
  }

  return Object.keys(borders).reduce((acc, val) => {
    const { color, width } = borders[val]
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')
}
