import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { card as tokens } from './Card.tokens'

type Props = {
  fullWidth?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const StyledCardMedia = styled.div<Props>`
  display: flex;
  width: 100%;
  &:last-child {
    margin-bottom: 8px;
    /* Last child to have 24px total spacing to bottom */
  }
  ${({ fullWidth }) =>
    fullWidth
      ? css`
          > * {
            width: calc(
              100% + ${tokens.spacings.left} + ${tokens.spacings.right}
            );
            margin-left: -${tokens.spacings.left};
            margin-right: -${tokens.spacings.right};
          }

          &:first-child {
            margin-top: -${tokens.spacings.top};
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

export const CardMedia = forwardRef<HTMLDivElement, Props>(
  function EdsCardMedia(
    { children, className = '', fullWidth = false, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      className,
      ref,
      fullWidth,
    }

    return <StyledCardMedia {...props}>{children}</StyledCardMedia>
  },
)

// CardMedia.displayName = 'eds-card-media'
