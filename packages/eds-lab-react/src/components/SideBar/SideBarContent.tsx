import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type SideBarContentProps = HTMLAttributes<HTMLDivElement>

const StyledSideBarContent = styled.div(({ theme }) => {
  return css`
    grid-area: content;
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
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
