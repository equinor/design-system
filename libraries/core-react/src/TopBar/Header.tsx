import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'

import { topbar as tokens } from './TopBar.tokens'

type Props = React.HTMLAttributes<HTMLDivElement>

const {
  title: { typography },
} = tokens

const StyledHeader = styled.div`
  grid-area: left;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 24px;
  align-items: center;
  ${typographyTemplate(typography)}
`

export const Header = forwardRef<HTMLDivElement, Props>(
  function EdsTopBarHeader({ children, ...props }, ref) {
    return (
      <StyledHeader ref={ref} {...props}>
        {children}
      </StyledHeader>
    )
  },
)

Header.displayName = 'eds-topbar-header'
