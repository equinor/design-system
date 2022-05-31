import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type SideBarFooterProps = HTMLAttributes<HTMLDivElement>

const StyledSideBarFooter = styled.div(({ theme }) => {
  return css`
    grid-area: footer;
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
    :last-child {
      padding-bottom: ${theme.spacings.bottom};
    }
    :first-child {
      padding-top: ${theme.spacings.top};
    }
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
