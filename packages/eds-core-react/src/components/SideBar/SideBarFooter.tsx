import { forwardRef, HTMLAttributes } from 'react'
import { styled, css } from 'styled-components'

type SideBarFooterProps = HTMLAttributes<HTMLDivElement>

const StyledSideBarFooter = styled.div(() => {
  return css`
    grid-area: footer;
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
