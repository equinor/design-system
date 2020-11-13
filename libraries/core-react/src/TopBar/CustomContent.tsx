import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

type CustomContentProps = HTMLAttributes<HTMLDivElement>

const StyledCustomContent = styled.div`
  grid-area: center;
`

export const CustomContent = forwardRef<HTMLDivElement, CustomContentProps>(
  function CustomContent({ children, ...props }, ref) {
    return (
      <StyledCustomContent ref={ref} {...props}>
        {children}
      </StyledCustomContent>
    )
  },
)

// CustomContent.displayName = 'eds-topbar-customcontent'
