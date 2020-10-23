import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'
import { Divider } from '../Divider'
import { BannerIcon } from './BannerIcon'

const { enabled } = tokens

const StyledBanner = styled.div``

type ContentProps = {
  hasIcon: boolean
}

const Content = styled.div<ContentProps>`
  padding: ${enabled.spacings};
  display: grid;
  grid-template-columns: ${({ hasIcon }) =>
    hasIcon ? 'min-content 1fr auto' : '1fr auto'};
  align-items: center;
`

const NonMarginDivider = styled(Divider)`
  margin: 0;
  height: 2px;
`

type Props = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const Banner: FC<Props> = ({ children, className, ...props }) => {
  const childrenWhereBannerIcon: boolean[] = React.Children.map(
    children,
    (child) => {
      return React.isValidElement(child) && child.type === BannerIcon
    },
  )
  const hasIcon = childrenWhereBannerIcon.some((bool) => bool)

  return (
    <StyledBanner {...props} className={className}>
      <Content hasIcon={hasIcon}>{children}</Content>
      <NonMarginDivider color="light" />
    </StyledBanner>
  )
}

// Banner.displayName = 'eds-banner'
