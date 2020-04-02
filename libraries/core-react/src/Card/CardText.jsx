import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'

import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCardText = styled(Typography)`
  /* grid-area: bottom; */
  padding-top: ${spacings.top};
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
`

// EDS - Supporting Text
export const CardText = forwardRef(function EdsCardText(
  { children, className, isLastBlock, ...rest },
  ref,
) {
  const blockVariant = isLastBlock ? 'last' : 'bottom'

  const props = {
    ...rest,
    className,
    ref,
    paddingBottom: tokens.spacings[blockVariant].bottom,
    padingTop: tokens.spacings[blockVariant].top,
  }
  return (
    <StyledCardText ref={ref} {...props} variant="body_short">
      {children}
    </StyledCardText>
  )
})

CardText.displayName = 'eds-card-supporting-text'

CardText.propTypes = {
  //  To be used as the last block
  isLastBlock: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardText.defaultProps = {
  isLastBlock: false,
  className: '',
  children: undefined,
}
