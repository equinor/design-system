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
  grid-template-columns: auto;
  grid-template-rows: ${({ rows }) => rows};
  align-items: center;
  align-content: start;
  border-radius: ${shape.borderRadius};
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  min-height: ${shape.minHeight};
  cursor: ${({ cursor }) => cursor};
`

export const Card = forwardRef(function EdsCard(
  { children, className, variant, onClick, ...rest },
  ref,
) {
  let rows = 'auto'

  if (children instanceof Array) {
    for (let i = 0; i < children.length - 1; i += 1) {
      rows += ' auto'
    }
  }

  const cursor = onClick ? 'pointer' : 'default'

  const props = {
    ...rest,
    className,
    ref,
    background: tokens.background[variant],
    rows,
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
