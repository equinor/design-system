import {
  Children,
  isValidElement,
  cloneElement,
  FC,
  HTMLAttributes,
  ReactNode,
} from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'
import { Icon } from '../Icon'

const { enabled } = tokens

type BannerIconVariant = 'info' | 'warning'

type StyledBannerIconProps = {
  variant: BannerIconVariant
}

const StyledBannerIcon = styled.span<StyledBannerIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: ${enabled.icon.shape.borderRadius};
  background-color: ${({ variant }) =>
    variant === 'warning'
      ? enabled.icon.warning.background
      : enabled.icon.info.background};
  width: ${enabled.icon.shape.minWidth};
  height: ${enabled.icon.shape.minHeight};
  margin-right: ${enabled.spacings};
`

type BannerIconProps = {
  /** Which icon background and fill color to use. Info = green, warning = red */
  variant?: BannerIconVariant
  /** @ignore */
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

export const BannerIcon: FC<BannerIconProps> = ({
  children,
  variant = 'info',
  ...props
}) => {
  const childrenWithColor = Children.map(children, (child) => {
    const color =
      variant === 'warning'
        ? enabled.icon.warning.color
        : enabled.icon.info.color
    return (
      (isValidElement(child) &&
        child.type === Icon &&
        cloneElement(child, {
          color,
        })) ||
      child
    )
  })
  return (
    <StyledBannerIcon variant={variant} {...props}>
      {childrenWithColor}
    </StyledBannerIcon>
  )
}

// BannerIcon.displayName = 'eds-banner-icon'
