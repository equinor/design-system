import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { card as tokens } from './Card.tokens'

const StyledCardHeaderTitle = styled.div`
  display: grid;
  flex-grow: 2;
  grid-auto-columns: auto;
  grid-gap: 8px;
  margin-left: ${({ marginLeft }) => marginLeft};
`

export const CardHeaderTitle = forwardRef(function EdsCardHeaderTitle(
  { children, className, marginLeft, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
    marginLeft: marginLeft ? tokens.spacings.left : 0,
  }

  return <StyledCardHeaderTitle {...props}>{children}</StyledCardHeaderTitle>
})

CardHeaderTitle.displayName = 'eds-card-header-title'

CardHeaderTitle.propTypes = {
  // For H6 variants with acitons, put margin left to allow Avatar on left side:
  marginLeft: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardHeaderTitle.defaultProps = {
  marginLeft: false,
  className: '',
  children: undefined,
}
