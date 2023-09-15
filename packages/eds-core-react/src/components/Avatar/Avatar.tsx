import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { bordersTemplate } from '@equinor/eds-utils'
import { avatar as tokens } from './Avatar.tokens'

type StyledAvatarProps = {
  $size: number
}

const StyledAvatar = styled.div<StyledAvatarProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  ${bordersTemplate(tokens.border)};
  ${({ $size }) => css`
    height: ${$size}px;
    width: ${$size}px;
  `}
`

type StyledImageProps = {
  alt: string
  src: string
  $disabled: boolean
}

const StyledImage = styled.img<StyledImageProps>`
  height: 100%;
  text-align: center;
  color: transparent;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: ${tokens.states.disabled.opacity};
    `};
`

export type AvatarProps = {
  alt: string
  /** Image source
   @default null */
  src?: string
  /** Avatar size
  @default 24 */
  size?: 16 | 24 | 32 | 40 | 48
  /** @default false */
  disabled?: boolean
} & HTMLAttributes<HTMLDivElement>

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src = null, alt, size = 24, disabled = false, ...rest },
  ref,
) {
  return (
    <StyledAvatar $size={size} ref={ref} {...rest}>
      <StyledImage src={src} alt={alt} $disabled={disabled} />
    </StyledAvatar>
  )
})

Avatar.displayName = 'Avatar'
