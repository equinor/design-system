import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

const StyledCardActions = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent};
`

export const CardActions = forwardRef(function EdsCardActions(
  { children, className, alignRight, meta, ...rest },
  ref,
) {
  const justifyContent = alignRight ? 'flex-end' : 'flex-start'
  const props = {
    ...rest,
    className,
    ref,
    justifyContent,
  }

  return (
    <StyledCardActions {...props}>
      {children}
      {meta !== '' && <Typography variant="caption">{meta}</Typography>}
    </StyledCardActions>
  )
})

CardActions.displayName = 'eds-card-actions'

CardActions.propTypes = {
  // Metadata / supporting text for icons ie:
  meta: PropTypes.string,
  // For user to align buttons on right side if they want:
  alignRight: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardActions.defaultProps = {
  meta: '',
  alignRight: false,
  className: '',
  children: undefined,
}
