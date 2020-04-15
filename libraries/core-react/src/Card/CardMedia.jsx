import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { card as tokens } from './Card.tokens'

const StyledCardMedia = styled.div`
  display: flex;
  width: 100%;
  ${({ fullWidth, spacing }) =>
    fullWidth
      ? css`
          margin-bottom: ${spacing};
          > * {
            width: calc(100% + ${spacing} + ${spacing}) !important;
            margin: -${spacing};
            border-top-right-radius: ${tokens.shape.borderRadius};
            border-top-left-radius: ${tokens.shape.borderRadius};
          }
        `
      : css`
          > * {
            width: 100% !important;
          }
        `}
`

export const CardMedia = forwardRef(function EdsCardMedia(
  { children, className, fullWidth, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
    fullWidth,
    spacing: tokens.spacings.left,
  }

  return <StyledCardMedia {...props}>{children}</StyledCardMedia>
})

CardMedia.displayName = 'eds-card-media'

CardMedia.propTypes = {
  // To be used if CardMedia is the leading block in Card
  fullWidth: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardMedia.defaultProps = {
  fullWidth: false,
  className: '',
  children: undefined,
}
