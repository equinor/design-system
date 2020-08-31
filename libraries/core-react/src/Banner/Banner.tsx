import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { banner as tokens } from './Banner.tokens'
import { Divider } from '../Divider'
import { BannerActions, BannerActionsProps } from './BannerActions'
import { BannerIcon, BannerIconProps } from './BannerIcon'
import { BannerMessage, BannerMessageProps } from './BannerMessage'
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
  children: ReactElement[] | ReactElement
  className?: string
  BannerActions?: BannerActionsProps
  BannerIcon?: BannerIconProps
  BannerMessage: BannerMessageProps
}

const Banner = ({ children, className, ...props }: Props) => {
  const displayNames = React.Children.map(children, (child: any) => {
    return child.type && child.type.displayName
  })
  const hasIcon = displayNames.includes('eds-banner-icon')

  return (
    <StyledBanner {...props} className={className}>
      <Content hasIcon={hasIcon}>{children}</Content>
      <NonMarginDivider color="light" />
    </StyledBanner>
  )
}

Banner.BannerActions = BannerActions
Banner.BannerIcon = BannerIcon
Banner.BannerMessage = BannerMessage

Banner.displayName = 'Banner'

export { Banner }
