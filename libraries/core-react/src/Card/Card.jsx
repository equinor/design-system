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
  grid-template-rows: ${({ rows }) => rows};
  /* grid-template-areas: ${({ areas }) => areas}; */
  align-items: center;
  border-radius: 4px;
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
`

export const Card = forwardRef(function EdsCard(
  { children, className, variant, ...rest },
  ref,
) {
  let rows = 'auto'
  if (children instanceof Array) {
    for (let i = 0; i < children.length - 1; i += 1) {
      rows += ' auto'
    }
  }

  const props = {
    ...rest,
    className,
    ref,
    background: tokens.background[variant],
    rows,
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
