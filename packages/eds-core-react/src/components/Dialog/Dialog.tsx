import { forwardRef, useMemo } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  bordersTemplate,
  useToken,
  mergeRefs,
} from '@equinor/eds-utils'
import { Paper } from '../Paper'
import { Scrim } from '../Scrim'
import { dialog as dialogToken } from './Dialog.tokens'
import { useEds } from '../EdsProvider'
import {
  FloatingPortal,
  useFloating,
  FloatingFocusManager,
} from '@floating-ui/react'

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
  const { density } = useEds()
  const token = useToken({ density }, dialogToken)
  const { floating, context } = useFloating()
  const handleDismiss = () => {
    onClose && onClose()
  }

  const dialogRef = useMemo(
    () => mergeRefs<HTMLDivElement>(floating, ref),
    [floating, ref],
  )

  const rest = {
    ...props,
    open,
  }

  return (
    <FloatingPortal id="eds-dialog-container">
      <ThemeProvider theme={token}>
        {open && (
          <Scrim open isDismissable={isDismissable} onClose={handleDismiss}>
            <FloatingFocusManager context={context} modal returnFocus>
              <StyledDialog elevation="above_scrim" {...rest} ref={dialogRef}>
                {children}
              </StyledDialog>
            </FloatingFocusManager>
          </Scrim>
        )}
      </ThemeProvider>
    </FloatingPortal>
  )
})

// Dialog.displayName = 'EdsDialog'
