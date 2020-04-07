import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCardText = styled(Typography)`
  margin-top: ${spacings.top};
  margin-bottom: ${spacings.bottom};
`

// EDS - Supporting Text
export const CardText = forwardRef(function EdsCardText(
  { children, className, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }
  return (
    <StyledCardText ref={ref} {...props} variant="body_short">
      {children}
    </StyledCardText>
  )
})

CardText.displayName = 'eds-card-supporting-text'

CardText.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardText.defaultProps = {
  className: '',
  children: undefined,
}
