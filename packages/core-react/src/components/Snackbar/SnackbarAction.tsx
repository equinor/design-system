import { Children, ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'

const StyledSnackbarAction = styled.div(({ theme }) => {
  return css`
    display: inline-flex;
    margin-left: ${theme.entities.actions.spacings.left};
    margin-top: ${theme.entities.actions.spacings.top};
    margin-bottom: ${theme.entities.actions.spacings.bottom};
  `
})

export type SnackbarActionProps = {
  children: ReactNode
}

export const SnackbarAction = forwardRef<HTMLDivElement, SnackbarActionProps>(
  function SnackbarAction({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }
    return (
      <StyledSnackbarAction {...props}>
        {Children.only(children)}
      </StyledSnackbarAction>
    )
  },
)
