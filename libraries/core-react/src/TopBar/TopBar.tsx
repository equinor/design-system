import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { topbar as tokens } from './TopBar.tokens'

export type TopbarProps = HTMLAttributes<HTMLElement>

const {
  background,
  height,
  spacings,
  border,
  title: { typography },
} = tokens

const StyledTopBar = styled.header`
  height: ${height};
  top: 0;
  position: sticky;
  background: ${background};
  box-sizing: border-box;
  z-index: 1000;
  display: grid;
  grid-column-gap: ${spacings.left};
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'left center right';
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)};
  ${typographyTemplate(typography)}
`

export const TopBar = forwardRef<HTMLElement, TopbarProps>(function TopBar(
  { children, ...props },
  ref,
) {
  return (
    <StyledTopBar {...props} ref={ref}>
      {children}
    </StyledTopBar>
  )
})

// TopBar.displayName = 'eds-topbar'
