import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import typography from '@equinor/eds-tokens/base/typography.json'

const { heading, paragraph } = typography

const variants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'overline',
  'ingress',
  'caption',
  'meta',
  'body_short',
  'body_long',
]

const variantToken = {
  ...heading,
  ...paragraph,
}

const getElementType = (variant, link) => {
  if (link) {
    return 'a'
  }
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant
    case 'caption':
    case 'overline':
    case 'ingress':
    case 'meta':
    case 'body_short':
    case 'body_long':
    default:
      return 'p'
  }
}

const toComplexVariantName = (
  variant,
  bold = false,
  italic = false,
  link = false,
) =>
  `${variant}${bold ? '_bold' : ''}${italic ? '_italic' : ''}${
    link ? '_link' : ''
  }`

const Base = ({ typography, link }) => {
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
  if (link) {
    base = base + 'cursor: pointer;'
  }

  return base
}

const TypographyBase = styled.p`
  ${Base}
`

const Typography = ({ variant, children, bold, italic, link, ...other }) => {
  const as = getElementType(variant, link)
  const variantName = toComplexVariantName(variant, bold, italic, link)
  let typography = variantToken[variantName]

  if (typeof typography === 'undefined') {
    console.warn(
      `Typography variant not found for "${variantName}". Trying to use ${variant}`,
    )
    typography = variantToken[variant]
  }

  if (typeof typography === 'undefined') {
    throw new Error(
      `Typography variant not found for ${variant}. Please use of the following variants: ${variants.toString()}`,
    )
  }
  return (
    <TypographyBase as={as} typography={typography} link={link} {...other}>
      {children}
    </TypographyBase>
  )
}

Typography.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(variants),
  /** Specifies if text should be bold */
  bold: PropTypes.bool,
  /** Specifies if text should be italic */
  italic: PropTypes.bool,
  /** Specifies if text should be a link */
  link: PropTypes.bool,
}

Typography.defaultProps = {
  variant: 'h1',
  className: '',
}

Typography.displayName = 'eds-text'

export default Typography
