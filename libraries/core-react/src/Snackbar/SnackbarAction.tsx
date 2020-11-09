import { Children, ReactNode } from 'react'
import styled from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'

const StyledSnackbarAction = styled.div`
  display: inline-flex;
  margin-left: ${tokens.spacings.actionSpace};
  margin-top: -10px;
  margin-bottom: -10px;
`

type SnackbarActionProps = {
  children: ReactNode
}

export const SnackbarAction = ({
  children,
}: SnackbarActionProps): JSX.Element => {
  return <StyledSnackbarAction>{Children.only(children)}</StyledSnackbarAction>
}
