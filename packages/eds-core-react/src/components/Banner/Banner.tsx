import {
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  Children as ReactChildren,
} from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { spacingsTemplate, useToken } from '@equinor/eds-utils'
import { enabled as bannerToken } from './Banner.tokens'
import { Divider } from '../Divider'
import { BannerIcon } from './BannerIcon'
import { useEds } from '../EdsProvider'

const StyledBanner = styled.div``

type ContentProps = {
  hasIcon: boolean
}

const Content = styled.div<ContentProps>(({ theme, hasIcon }) => {
  return css`
    ${spacingsTemplate(theme.spacings)}

    display: grid;
    grid-template-columns: ${hasIcon ? 'min-content 1fr auto' : '1fr auto'};
    align-items: center;
    background-color: ${theme.background};
  `
})

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

  const { density } = useEds()
  const token = useToken({ density }, bannerToken)

  return (
    <ThemeProvider theme={token}>
      <StyledBanner {...props} className={className} role="alert">
        <Content hasIcon={hasIcon}>{children}</Content>
        <NonMarginDivider color="light" />
      </StyledBanner>
    </ThemeProvider>
  )
})
