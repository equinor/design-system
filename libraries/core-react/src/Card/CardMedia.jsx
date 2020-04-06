import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { card as tokens } from './Card.tokens'

const StyledCardMedia = styled.div`
  width: inherit;
  padding-top: ${({ paddingTop }) => paddingTop};
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
  margin-left: ${({ marginLeft }) => marginLeft};

  img:first-child {
    position: relative;
    width: ${({ imgWidth }) => imgWidth};
  }
`

// EDS - Supporting Text
export const CardMedia = forwardRef(function EdsCardMedia(
  { children, className, order, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
    paddingBottom: tokens.spacings[order].bottom,
    paddingTop: tokens.spacings[order].top,
    marginLeft: tokens.spacings[order].marginLeft,
    imgWidth: tokens.spacings[order].width,
    order,
  }

  return <StyledCardMedia {...props}>{children}</StyledCardMedia>
})

CardMedia.displayName = 'eds-card-supporting-text'

CardMedia.propTypes = {
  //  To be used as the last block
  order: PropTypes.oneOf(['middle', 'last', 'leading']),
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardMedia.defaultProps = {
  order: 'middle',
  className: '',
  children: undefined,
}
