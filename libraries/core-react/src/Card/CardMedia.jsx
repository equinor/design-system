import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { card as tokens } from './Card.tokens'

const StyledCardMedia = styled.div`
  width: inherit;
  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  margin-left: ${({ marginLeft }) => marginLeft};

  > * {
    position: relative;
    width: ${({ imgWidth }) => imgWidth} !important;
  }
`

// EDS - Supporting Text
export const CardMedia = forwardRef(function EdsCardMedia(
  { children, className, isLeading, ...rest },
  ref,
) {
  const styleToken = isLeading ? 'leading' : 'middle'
  const props = {
    ...rest,
    className,
    ref,
    marginBottom: tokens.spacings[styleToken].bottom,
    marginTop: tokens.spacings[styleToken].top,
    marginLeft: tokens.spacings[styleToken].marginLeft,
    imgWidth: tokens.spacings[styleToken].width,
    isLeading,
  }

  return <StyledCardMedia {...props}>{children}</StyledCardMedia>
})

CardMedia.displayName = 'eds-card-media'

CardMedia.propTypes = {
  // To be used if CardMedia is the leading block in Card
  isLeading: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardMedia.defaultProps = {
  isLeading: false,
  className: '',
  children: undefined,
}
