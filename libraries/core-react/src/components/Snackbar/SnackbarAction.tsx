import { Children, ReactNode } from 'react'
import styled from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'

const StyledSnackbarAction = styled.div`
  display: inline-flex;
  margin-left: ${tokens.entities.actions.spacings.left};
  margin-top: ${tokens.entities.actions.spacings.top};
  margin-bottom: ${tokens.entities.actions.spacings.bottom};
`

export type SnackbarActionProps = {
  children: ReactNode
}

export const SnackbarAction = ({
  children,
}: SnackbarActionProps): JSX.Element => {
  return <StyledSnackbarAction>{Children.only(children)}</StyledSnackbarAction>
}
