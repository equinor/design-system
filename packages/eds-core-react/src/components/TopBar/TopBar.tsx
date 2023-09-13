import { forwardRef, HTMLAttributes } from 'react'
import { styled, css, ThemeProvider } from 'styled-components'
import {
  spacingsTemplate,
  typographyTemplate,
  bordersTemplate,
  useToken,
} from '@equinor/eds-utils'
import { Paper } from '../Paper'
import type { Elevations } from '@equinor/eds-tokens'
import { topbar as topbarToken } from './TopBar.tokens'
import { useEds } from '../EdsProvider'

type AvailableElevations = keyof Pick<Elevations, 'none' | 'raised'>

export type TopbarProps = {
  elevation?: AvailableElevations
  /** Topbar will stick to top when scrolling. */
  sticky?: boolean
} & HTMLAttributes<HTMLDivElement>

const StyledTopBar = styled(Paper)<TopbarProps>(({ theme, sticky }) => {
  return css`
    height: ${theme.height};
    background: ${theme.background};
    box-sizing: border-box;
    display: grid;
    grid-column-gap: ${theme.spacings.left};
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'left center right';
    align-items: center;
    ${bordersTemplate(theme.border)}
    ${spacingsTemplate(theme.spacings)};
    ${typographyTemplate(theme.typography)}

    ${sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 1100;
    `}
  `
})

export const TopBar = forwardRef<HTMLDivElement, TopbarProps>(function TopBar(
  { children, elevation = 'none', sticky = true, ...props },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, topbarToken)
  const rest = {
    ...props,
    ref,
  }
  return (
    <ThemeProvider theme={token}>
      <StyledTopBar
        forwardedAs={'header'}
        elevation={elevation}
        sticky={sticky}
        {...rest}
      >
        {children}
      </StyledTopBar>
    </ThemeProvider>
  )
})

// TopBar.displayName = 'eds-topbar'
