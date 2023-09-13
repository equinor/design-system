import { forwardRef } from 'react'
import { styled, css } from 'styled-components'

const StyledDialogActions = styled.div<DialogActionsProps>(
  ({ theme, children }) => {
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
  },
)

export type DialogActionsProps = React.HTMLAttributes<HTMLDivElement>

export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(
  function DialogActions({ children, ...props }, ref) {
    return (
      <StyledDialogActions ref={ref} {...props}>
        {children}
      </StyledDialogActions>
    )
  },
)

// Actions.displayName = 'EdsDialogActions'
