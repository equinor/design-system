import * as React from 'react'
import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { dialog as tokens } from './Dialog.tokens'

const { spacingsMedium } = tokens

const StyledActions = styled.div<ActionProps>`
  min-height: 48px;
  padding: 0 ${spacingsMedium};
  align-self: end;
  justify-self: start;

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: 8px;
    `}
`

type ActionProps = React.HTMLAttributes<HTMLDivElement>

export const Actions = forwardRef<HTMLDivElement, ActionProps>(function Actions(
  { children, ...props },
  ref,
) {
  return (
    <StyledActions ref={ref} {...props}>
      {children}
    </StyledActions>
  )
})

// Actions.displayName = 'EdsDialogActions'
