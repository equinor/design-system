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
          > * {
            width: calc(100% + ${spacing} + ${spacing});
            margin-left: -${spacing};
          }

          &:first-child {
            margin-top: -${spacing};
            img {
              border-top-right-radius: ${tokens.shape.borderRadius};
              border-top-left-radius: ${tokens.shape.borderRadius};
            }
          }
          &:last-child {
            margin-bottom: -${spacing};
            img {
              border-bottom-right-radius: ${tokens.shape.borderRadius};
              border-bottom-left-radius: ${tokens.shape.borderRadius};
            }
          }
        `
      : css`
          > * {
            width: 100%;
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
