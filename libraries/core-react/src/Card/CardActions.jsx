import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { card as tokens } from './Card.tokens'
import { Typography } from '../Typography'

const { spacings } = tokens

const StyledCardActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacings.actions.top};
  margin-bottom: ${spacings.actions.bottom} !important;
  justify-content: ${({ justifyContent }) => justifyContent};
  > :not(:first-child) {
    margin-left: ${spacings.actions.left};
  }
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
