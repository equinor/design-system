import { forwardRef } from 'react'
import { createPortal } from 'react-dom'
import styled, { css, ThemeProvider } from 'styled-components'
import { typographyTemplate, bordersTemplate } from '../../utils'
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
    grid-auto-columns: auto;
    ${typographyTemplate(theme.typography)}
    ${bordersTemplate(theme.border)}
    grid-gap: ${theme.spacings.bottom};
  `
})

export type DialogProps = {
  /** Whether Dialog can be dismissed with esc key and outside click
   */
  isDismissable?: boolean
  /** programmatically toggle dialog */
  open: boolean
  /** callback to handle closing scrim */
  onClose?: () => void
} & React.HTMLAttributes<HTMLDivElement>

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { children, open, onClose, isDismissable = false, ...props },
  ref,
) {
  const rest = {
    ...props,
    open,
    ref,
  }
  const { density } = useEds()
  const token = useToken({ density }, dialogToken)
  const handleDismiss = () => {
    onClose && onClose()
  }

  if (!open) {
    return null
  }

  return (
    <>
      {createPortal(
        <ThemeProvider theme={token}>
          <Scrim open isDismissable={isDismissable} onClose={handleDismiss}>
            <StyledDialog elevation="above_scrim" {...rest}>
              {children}
            </StyledDialog>
          </Scrim>
        </ThemeProvider>,
        document.body,
      )}
    </>
  )
})

// Dialog.displayName = 'EdsDialog'
