import React, { forwardRef } from 'react'
import styled from 'styled-components'

type Props = React.HTMLAttributes<HTMLDivElement>

const StyledCustomContent = styled.div`
  grid-area: center;
`

export const CustomContent = forwardRef<HTMLDivElement, Props>(
  function EdsTopBarCustomContent({ children, ...props }, ref) {
    return (
      <StyledCustomContent ref={ref} {...props}>
        {children}
      </StyledCustomContent>
    )
  },
)

CustomContent.displayName = 'eds-topbar-customcontent'
