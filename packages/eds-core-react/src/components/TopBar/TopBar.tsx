import { forwardRef, HTMLAttributes } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
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
} & HTMLAttributes<HTMLDivElement>

const StyledTopBar = styled(Paper)<TopbarProps>(({ theme }) => {
  return css`
    height: ${theme.height};
    top: 0;
    position: sticky;
    background: ${theme.background};
    box-sizing: border-box;
    z-index: 1100;
    display: grid;
    grid-column-gap: ${theme.spacings.left};
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'left center right';
    align-items: center;
    ${bordersTemplate(theme.border)}
    ${spacingsTemplate(theme.spacings)};
    ${typographyTemplate(theme.typography)}
  `
})

export const TopBar = forwardRef<HTMLDivElement, TopbarProps>(function TopBar(
  { children, elevation = 'none', ...props },
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
      <StyledTopBar elevation={elevation} {...rest}>
        {children}
      </StyledTopBar>
    </ThemeProvider>
  )
})

// TopBar.displayName = 'eds-topbar'
