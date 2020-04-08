import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { card as tokens } from './Card.tokens'

const { spacings, shape } = tokens

const StyledCard = styled.div`
  height: fit-content;
  width: 100%;
  min-width: ${shape.minWidth};
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: grid;
  grid-column-gap: 0;
  grid-auto-columns: auto;
  align-items: center;
  align-content: start;
  border-radius: ${shape.borderRadius};
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  min-height: ${shape.minHeight};
  cursor: ${({ cursor }) => cursor};

  > :last-child {
    margin-bottom: ${spacings.last.bottom};
  }
`

export const Card = forwardRef(function EdsCard(
  { children, className, variant, onClick, ...rest },
  ref,
) {
  const cursor = onClick ? 'pointer' : 'default'

  const props = {
    ...rest,
    className,
    ref,
    background: tokens.background[variant],
    cursor,
  }

  return (
    <StyledCard {...props} onClick={onClick}>
      {children}
    </StyledCard>
  )
})

Card.displayName = 'eds-card'

Card.propTypes = {
  // Variant / background color (default, info, danger, warning):
  variant: PropTypes.oneOf(['default', 'info', 'warning', 'danger']),
  // Onclick function (for clickable cards)
  onClick: PropTypes.func,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Card.defaultProps = {
  variant: 'default',
  onClick: undefined,
  className: '',
  children: undefined,
}
