import * as React from 'react'
import { FC, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'
import { Icon } from '../Icon'

type BannerIconVariant = 'info' | 'warning'

type StyledBannerIconProps = {
  variant: BannerIconVariant
}

const StyledBannerIcon = styled.span<StyledBannerIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: ${tokens.icon.shape.borderRadius};
  background-color: ${({ variant }) =>
    variant === 'warning'
      ? tokens.icon.warning.background
      : tokens.icon.info.background};
  width: ${tokens.icon.shape.minWidth};
  height: ${tokens.icon.shape.minHeight};
  margin-right: ${tokens.spacings.right};
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
  const childrenWithColor = React.Children.map(children, (child) => {
    const color =
      variant === 'warning' ? tokens.icon.warning.color : tokens.icon.info.color
    return (
      (React.isValidElement(child) &&
        child.type === Icon &&
        React.cloneElement(child, {
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
