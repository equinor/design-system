import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

export type TopbarActionsProps = HTMLAttributes<HTMLDivElement>

const StyledActions = styled.div`
  grid-area: right;
  text-align: right;
`

export const Actions = forwardRef<HTMLDivElement, TopbarActionsProps>(
  function Actions({ children, ...props }, ref) {
    return (
      <StyledActions ref={ref} {...props}>
        {children}
      </StyledActions>
    )
  },
)

// Actions.displayName = 'eds-topbar-actions'
