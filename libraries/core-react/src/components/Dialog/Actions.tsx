import { forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { dialog as dialogToken } from './Dialog.tokens'
import { spacingsTemplate } from '../../utils'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const StyledActions = styled.div<DialogActionsProps>(({ theme, children }) => {
  return css`
    min-height: ${theme.entities.actions.minHeight};
    ${spacingsTemplate(theme.entities.children.spacings)}
    align-self: end;
    justify-self: start;

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
    const { density } = useEds()
    const token = useToken({ density }, dialogToken)
    return (
      <ThemeProvider theme={token}>
        <StyledActions ref={ref} {...props}>
          {children}
        </StyledActions>
      </ThemeProvider>
    )
  },
)

// Actions.displayName = 'EdsDialogActions'
