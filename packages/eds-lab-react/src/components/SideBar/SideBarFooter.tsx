import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type SideBarFooterProps = HTMLAttributes<HTMLDivElement>

const StyledSideBarFooter = styled.div(({ theme }) => {
  return css`
    grid-area: footer;
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
  `
})

export const SideBarFooter = forwardRef<HTMLDivElement, SideBarFooterProps>(
  function SideBarFooter({ children, ...rest }, ref) {
    const props = {
      ref,
      ...rest,
    }

    return <StyledSideBarFooter {...props}>{children}</StyledSideBarFooter>
  },
)
