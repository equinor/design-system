import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

type ActionsProps = HTMLAttributes<HTMLDivElement>

const StyledActions = styled.div`
  grid-area: right;
  text-align: right;
`

export const Actions = forwardRef<HTMLDivElement, ActionsProps>(
  function Actions({ children, ...props }, ref) {
    return (
      <StyledActions ref={ref} {...props}>
        {children}
      </StyledActions>
    )
  },
)

// Actions.displayName = 'eds-topbar-actions'
