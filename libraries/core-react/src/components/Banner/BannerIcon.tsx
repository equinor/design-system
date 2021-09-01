import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Children as ReactChildren,
  isValidElement,
  cloneElement,
} from 'react'
import styled from 'styled-components'
import * as tokens from './Banner.tokens'
import { Icon } from '../Icon'
import { bordersTemplate } from '../../utils'

type BannerIconVariant = 'info' | 'warning'

type StyledBannerIconProps = {
  variant: BannerIconVariant
}

const { enabled, info, warning } = tokens

const StyledBannerIcon = styled.span<StyledBannerIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${bordersTemplate(enabled.entities.icon.border)};
  background-color: ${({ variant }) =>
    variant === 'warning'
      ? warning.entities.icon.background
      : info.entities.icon.background};
  width: ${enabled.entities.icon.width};
  height: ${enabled.entities.icon.height};
  margin-right: ${enabled.spacings.right};
`

export type BannerIconProps = {
  /** Which icon background and fill color to use. Info = green, warning = red */
  variant?: BannerIconVariant
  /** @ignore */
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

export const BannerIcon = forwardRef<HTMLSpanElement, BannerIconProps>(
  function BannerIcon({ children, variant = 'info', ...rest }, ref) {
    const childrenWithColor = ReactChildren.map(children, (child) => {
      const color =
        variant === 'warning'
          ? warning.entities.icon.typography.color
          : info.entities.icon.typography.color
      return (
        (isValidElement(child) &&
          child.type === Icon &&
          cloneElement(child, {
            color,
          })) ||
        child
      )
    })

    const props = {
      ref,
      ...rest,
    }

    return (
      <StyledBannerIcon variant={variant} {...props}>
        {childrenWithColor}
      </StyledBannerIcon>
    )
  },
)
