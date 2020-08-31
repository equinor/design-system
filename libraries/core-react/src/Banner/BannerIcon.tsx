import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'

const { enabled } = tokens

type StyledBannerIconProps = {
  variant: 'warning' | 'info'
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

export type BannerIconProps = {
  children: ReactElement
  /** Which icon background and fill color to use. Info = green, warning = red */
  variant?: 'warning' | 'info'
}

export const BannerIcon = ({
  children,
  variant = 'info',
  ...props
}: BannerIconProps) => {
  const childrenWithColor = React.Children.map(children, (child: any) => {
    const color =
      variant === 'warning'
        ? enabled.icon.warning.color
        : enabled.icon.info.color
    return (
      (child.type.displayName === 'eds-icon' &&
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

BannerIcon.displayName = 'BannerIcon'
