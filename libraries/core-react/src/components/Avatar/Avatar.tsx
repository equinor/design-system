import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { avatar as tokens } from './Avatar.tokens'

const {
  enabled: { border },
  disabled: { image: disabledImage },
} = tokens

type StyledAvatarProps = {
  size: number
  disabled: boolean
}

const StyledAvatar = styled.div<StyledAvatarProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${border.radius};
  ${({ size }) =>
    css`
      height: ${size}px;
      width: ${size}px;
    `}
`

type StyledImageProps = {
  alt: string
  src: string
  disabled: boolean
}

const StyledImage = styled.img<StyledImageProps>`
  height: 100%;
  text-align: center;
  color: transparent;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: ${disabledImage.opacity};
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
    <StyledAvatar size={size} disabled={disabled} ref={ref} {...rest}>
      <StyledImage src={src} alt={alt} disabled={disabled} />
    </StyledAvatar>
  )
})

Avatar.displayName = 'Avatar'
