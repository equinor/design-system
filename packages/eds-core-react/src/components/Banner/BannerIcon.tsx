import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Children as ReactChildren,
  isValidElement,
  cloneElement,
  ReactElement,
} from 'react'
import styled, { css } from 'styled-components'
import * as tokens from './Banner.tokens'
import { Icon } from '../Icon'
import { bordersTemplate } from '@equinor/eds-utils'

type BannerIconVariant = 'info' | 'warning'

type StyledBannerIconProps = {
  $variant: BannerIconVariant
}

const { info, warning } = tokens

const StyledBannerIcon = styled.span<StyledBannerIconProps>(
  ({ theme, $variant }) => {
    return css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      ${bordersTemplate(theme.entities.icon.border)};
      background-color: ${$variant === 'warning'
        ? warning.entities.icon.background
        : info.entities.icon.background};
      width: ${theme.entities.icon.width};
      height: ${theme.entities.icon.height};
      margin-right: ${theme.spacings.right};
    `
  },
)

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
          cloneElement(child as ReactElement<BannerIconProps>, {
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
      <StyledBannerIcon $variant={variant} {...props}>
        {childrenWithColor}
      </StyledBannerIcon>
    )
  },
)
