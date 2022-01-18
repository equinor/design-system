import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

const StyledActions = styled.div<DialogActionsProps>(({ theme, children }) => {
  return css`
    align-self: end;
    justify-self: start;
    padding: 0 ${theme.entities.children.spacings.right} 0
      ${theme.entities.children.spacings.left};
    &:first-child {
      padding-top: ${theme.entities.children.spacings.top};
    }
    &:last-child {
      padding-bottom: ${theme.entities.children.spacings.bottom};
    }

    ${!children &&
    css`
      min-height: initial;
      height: '8px';
    `}
  `
})

export type DialogActionsProps = React.HTMLAttributes<HTMLDivElement>

export const Actions = forwardRef<HTMLDivElement, DialogActionsProps>(
  function Actions({ children, ...props }, ref) {
    return (
      <StyledActions ref={ref} {...props}>
        {children}
      </StyledActions>
    )
  },
)

// Actions.displayName = 'EdsDialogActions'
