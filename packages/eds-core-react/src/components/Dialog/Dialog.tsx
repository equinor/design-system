import { forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { Paper } from '../Paper'
import { Scrim } from '../Scrim'
import { dialog as dialogToken } from './Dialog.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const StyledDialog = styled(Paper).attrs<DialogProps>({
  tabIndex: 0,
  role: 'dialog',
  'aria-labelledby': 'eds-dialog-title',
  'aria-describedby': 'eds-dialog-customcontent',
  'aria-modal': true,
})(({ theme }) => {
  return css`
    width: ${theme.width};
    background: ${theme.background};
    display: grid;
    ${typographyTemplate(theme.typography)}
    ${spacingsTemplate(theme.spacings)}
    ${bordersTemplate(theme.border)}
  `
})

export type DialogProps = {
  /** programmatically toggle dialog */
  open: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { children, open, ...props },
  ref,
) {
  const rest = {
    ...props,
    open,
    ref,
  }
  const { density } = useEds()
  const token = useToken({ density }, dialogToken)

  if (!open) {
    return null
  }

  return (
    <ThemeProvider theme={token}>
      <Scrim open={true}>
        <StyledDialog
          role="dialog"
          aria-labelledby="eds-dialog-title"
          elevation="above_scrim"
          {...rest}
        >
          {children}
        </StyledDialog>
      </Scrim>
    </ThemeProvider>
  )
})

// Dialog.displayName = 'EdsDialog'
