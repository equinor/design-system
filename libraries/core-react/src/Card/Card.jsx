import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { card as tokens } from './Card.tokens'

const {
  background,
  height,
  spacings,
  border,
  title: { text },
} = tokens

const StyledCard = styled.header`
  height: ${height};
  position: relative;
  background: ${background};
  box-sizing: border-box;
  display: grid;
  grid-column-gap: ${spacings.left};
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'top center bottom';
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)};
  ${typographyTemplate(text)}
`

export const Card = forwardRef(function EdsCard({ children, ...props }, ref) {
  return (
    <StyledCard {...props} ref={ref}>
      {children}
    </StyledCard>
  )
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
