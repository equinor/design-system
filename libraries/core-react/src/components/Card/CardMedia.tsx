import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { primary as tokens } from './Card.tokens'

const { spacings, border } = tokens

export type CardMediaProps = {
  /** Should the media be full width or not */
  fullWidth?: boolean
} & HTMLAttributes<HTMLDivElement>

const StyledCardMedia = styled.div<CardMediaProps>`
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
            width: calc(100% + ${spacings.left} + ${spacings.right});
            margin-left: -${spacings.left};
            margin-right: -${spacings.right};
          }

          &:first-child {
            margin-top: -${spacings.top};
            img {
              border-top-right-radius: ${border.type === 'border' &&
              border.radius};
              border-top-left-radius: ${border.type === 'border' &&
              border.radius};
            }
          }
        `
      : css`
          > * {
            width: 100%;
          }
        `}
`

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  function CardMedia(
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
