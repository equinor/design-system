import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCard = styled.div`
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: grid;
  grid-column-gap: 0;
  grid-template-columns: auto;
  grid-template-areas: 'top' 'center' 'bottom';
  align-items: center;
  border-radius: 4px;
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
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
  variant: PropTypes.oneOf(['default', 'info', 'warning', 'danger']),
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
