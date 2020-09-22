import React, { forwardRef } from 'react'
import styled from 'styled-components'

type Props = React.HTMLAttributes<HTMLDivElement>

const StyledActions = styled.div`
  grid-area: right;
  text-align: right;
`

export const Actions = forwardRef<HTMLDivElement, Props>(
  function EdsTopBarActions({ children, ...props }, ref) {
    return (
      <StyledActions ref={ref} {...props}>
        {children}
      </StyledActions>
    )
  },
)

Actions.displayName = 'eds-topbar-actions'
