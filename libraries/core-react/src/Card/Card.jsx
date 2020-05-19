import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { card as tokens } from './Card.tokens'
import { spacingsTemplate } from '../_common/templates'

const { spacings, shape } = tokens

const StyledCard = styled.div`
  height: fit-content;
  width: 100%;
  min-width: ${shape.minWidth};
  position: relative;
  background-color: ${({ background }) => background};
  box-sizing: border-box;
  display: grid;
  grid-gap: 16px;
  grid-auto-columns: auto;
  align-items: center;
  align-content: start;
  border-radius: ${shape.borderRadius};
  min-height: ${shape.minHeight};
  cursor: ${({ cursor }) => cursor};

  ${spacingsTemplate(spacings)}
`

/**
 * @typedef Props
 * @prop {'default' | 'info' | 'warning' | 'danger'} [variant] Background color
 * @prop {() => void} [onClick] Onclick function (for clickable cards)
 */

export const Card = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLDivElement>} props
   * @param rest
   * @param ref
   */
  function EdsCard({ children, className, variant, onClick, ...rest }, ref) {
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
  },
)

Card.displayName = 'eds-card'

Card.propTypes = {
  // Background color:
  // @ts-ignore
  variant: PropTypes.oneOf(['default', 'info', 'warning', 'danger']),
  // Onclick function (for clickable cards)
  onClick: PropTypes.func,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Card.defaultProps = {
  // @ts-ignore
  variant: 'default',
  onClick: undefined,
  className: '',
  children: undefined,
}
