import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { card as tokens } from './Card.tokens'

const StyledCardMedia = styled.div`
  display: flex;
  width: 100%;
  &:last-child {
    margin-bottom: 8px;
    /* Last child to have 24px total spacing to bottom */
  }
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
        `
      : css`
          > * {
            width: 100%;
          }
        `}
`

/**
 * @typedef Props
 * @prop {boolean} [fullWidth] Full width ignores Card padding
 */

export const CardMedia = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLDivElement>} props
   * @param rest
   * @param ref
   */
  function EdsCardMedia({ children, className, fullWidth, ...rest }, ref) {
    const props = {
      ...rest,
      className,
      ref,
      fullWidth,
      spacing: tokens.spacings.left,
    }

    return <StyledCardMedia {...props}>{children}</StyledCardMedia>
  },
)

CardMedia.displayName = 'eds-card-media'

CardMedia.propTypes = {
  // Full width ignores Card padding
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
