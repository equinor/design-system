import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate } from '../_common/templates'
import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCard = styled.header`
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: grid;
  grid-column-gap: 0;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'top center bottom';
  align-items: center;

  ${spacingsTemplate(spacings)};
`

export const Card = forwardRef(function EdsCard(
  { children, className, variant, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
    background: tokens.background[variant],
  }

  return <StyledCard {...props}>{children}</StyledCard>
})

Card.displayName = 'eds-card'

Card.propTypes = {
  // Variant (default, info, danger, warning - background colors):
  variant: PropTypes.string,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Card.defaultProps = {
  variant: 'default',
  className: '',
  children: undefined,
}
