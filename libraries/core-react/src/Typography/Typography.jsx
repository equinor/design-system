import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { typographyTemplate } from '../_common/templates'

const { heading, paragraph } = tokens.typography

const groupNames = Object.keys(tokens.typography)

// Only used for propTypes as groups have duplicate variants
const variantNames = Object.keys(
  Object.entries({ ...tokens.typography }).reduce(
    (acc, [, val]) => ({ ...acc, ...val }),
    {},
  ),
)

const quickVariants = {
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

const findTypography = (variantName, group) => {
  // For quick use when using paragraphs and headings we can skip group
  if (typeof group === 'undefined') {
    return quickVariants[variantName]
  }

  return tokens.typography[group][variantName]
}

const toVariantName = (variant, bold = false, italic = false, link = false) =>
  `${variant}${bold ? '_bold' : ''}${italic ? '_italic' : ''}${
    link ? '_link' : ''
  }`

const StyledTypography = styled.p`
  ${({ typography, link }) => css`
    ${typographyTemplate(typography, link)}
  `}
`

export const Typography = forwardRef(function EdsTypography(
  { variant, children, bold, italic, link, group, ...other },
  ref,
) {
  const as = getElementType(variant, link)
  const variantName = toVariantName(variant, bold, italic, link)
  let typography = findTypography(variantName, group)

  if (typeof typography === 'undefined') {
    throw new Error(
      `Typography variant not found for variant "${variantName}" ("${variant}") & group "${
        group || ''
      }"`,
    )
  }
  return (
    <StyledTypography
      as={as}
      typography={typography}
      link={link}
      ref={ref}
      {...other}
    >
      {children}
    </StyledTypography>
  )
})

Typography.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(variantNames),
  /** Specifices which typography group to use  */
  group: PropTypes.oneOf(groupNames),
  /** Specifies if text should be bold */
  bold: PropTypes.bool,
  /** Specifies if text should be italic */
  italic: PropTypes.bool,
  /** Specifies if text should be a link */
  link: PropTypes.bool,
}

Typography.defaultProps = {
  variant: 'body_short',
  group: undefined,
  bold: false,
  italic: false,
  link: false,
  className: '',
}

Typography.displayName = 'eds-typography'
