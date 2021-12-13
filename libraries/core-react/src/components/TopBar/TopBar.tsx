import { forwardRef, HTMLAttributes } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  spacingsTemplate,
  typographyTemplate,
  bordersTemplate,
} from '../../utils'
import { topbar as topbarToken } from './TopBar.tokens'
import { useToken } from '../../hooks'
import { useEds } from '../EdsProvider'

export type TopbarProps = HTMLAttributes<HTMLElement>

const StyledTopBar = styled.header(({ theme }) => {
  return css`
    height: ${theme.height};
    top: 0;
    position: sticky;
    background: ${theme.background};
    box-sizing: border-box;
    z-index: 250;
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

export const TopBar = forwardRef<HTMLElement, TopbarProps>(function TopBar(
  { children, ...props },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, topbarToken)
  return (
    <ThemeProvider theme={token}>
      <StyledTopBar {...props} ref={ref}>
        {children}
      </StyledTopBar>
    </ThemeProvider>
  )
})

// TopBar.displayName = 'eds-topbar'
