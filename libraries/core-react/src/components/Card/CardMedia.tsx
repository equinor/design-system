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
  width: auto;
  &:last-child {
    img {
      border-bottom-right-radius: ${border.type === 'border' && border.radius};
      border-bottom-left-radius: ${border.type === 'border' && border.radius};
    }
  }
  ${({ fullWidth }) =>
    fullWidth
      ? css`
          > * {
            width: 100%;
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
          padding: 0 ${spacings.right} 0 ${spacings.left};
          > * {
            width: 100%;
          }
        `}
`

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  function CardMedia({ children, fullWidth = false, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
      fullWidth,
    }

    return <StyledCardMedia {...props}>{children}</StyledCardMedia>
  },
)
