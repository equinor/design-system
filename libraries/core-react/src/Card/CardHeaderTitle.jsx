import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCardHeaderTitle = styled.div`
  display: grid;
  grid-auto-columns: auto;
  flex-grow: 2;
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
    marginLeft: marginLeft ? '16px' : 0,
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
