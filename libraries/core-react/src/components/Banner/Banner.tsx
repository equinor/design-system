import {
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  Children as ReactChildren,
} from 'react'
import styled from 'styled-components'
import * as tokens from './Banner.tokens'
import { Divider } from '../Divider'
import { BannerIcon } from './BannerIcon'
import { spacingsTemplate } from '../../utils'

const StyledBanner = styled.div``

type ContentProps = {
  hasIcon: boolean
}

const { enabled } = tokens

const Content = styled.div<ContentProps>`
  ${spacingsTemplate(enabled.spacings)}

  display: grid;
  grid-template-columns: ${({ hasIcon }) =>
    hasIcon ? 'min-content 1fr auto' : '1fr auto'};
  align-items: center;
  background-color: ${enabled.background};
`

const NonMarginDivider = styled(Divider)`
  margin: 0;
  height: 2px;
`

export type BannerProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { children, className, ...rest },
  ref,
) {
  const childrenWhereBannerIcon: boolean[] = ReactChildren.map(
    children,
    (child) => {
      return isValidElement(child) && child.type === BannerIcon
    },
  )
  const hasIcon = childrenWhereBannerIcon.some((bool) => bool)

  const props = {
    ref,
    ...rest,
  }

  return (
    <StyledBanner {...props} className={className} role="alert">
      <Content hasIcon={hasIcon}>{children}</Content>
      <NonMarginDivider color="light" />
    </StyledBanner>
  )
})
