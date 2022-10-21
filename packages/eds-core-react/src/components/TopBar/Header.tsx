import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

export type TopbarHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledHeader = styled.div`
  grid-area: left;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 12px;
  align-items: center;
`

export const Header = forwardRef<HTMLDivElement, TopbarHeaderProps>(
  function Header({ children, ...props }, ref) {
    return (
      <StyledHeader ref={ref} {...props}>
        {children}
      </StyledHeader>
    )
  },
)

// Header.displayName = 'eds-topbar-header'
