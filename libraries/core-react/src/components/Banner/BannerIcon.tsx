import * as React from 'react'
import { FC, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'
import { Icon } from '../Icon'
import { bordersTemplate } from '@utils'

type BannerIconVariant = 'info' | 'warning'

type StyledBannerIconProps = {
  variant: BannerIconVariant
}

const { entities } = tokens
const { icon } = entities

const StyledBannerIcon = styled.span<StyledBannerIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${bordersTemplate(icon.border)};
  background-color: ${({ variant }) =>
    variant === 'warning'
      ? icon.variants.warning.background
      : icon.variants.info.background};
  width: ${icon.width};
  height: ${icon.height};
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
      variant === 'warning'
        ? icon.variants.warning.typography.color
        : icon.variants.info.typography.color
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
