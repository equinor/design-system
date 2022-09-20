import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

type SideBarContentProps = HTMLAttributes<HTMLDivElement>

const StyledSideBarContent = styled.div(({ theme }) => {
  return css`
    grid-area: content;
    :last-child {
      padding-bottom: ${theme.spacings.bottom};
    }
    :first-child {
      padding-top: ${theme.spacings.top};
    }
  `
})

export const SideBarContent = forwardRef<HTMLDivElement, SideBarContentProps>(
  function SideBarContent({ children, ...rest }, ref) {
    const props = {
      ref,
      ...rest,
    }

    return <StyledSideBarContent {...props}>{children}</StyledSideBarContent>
  },
)
