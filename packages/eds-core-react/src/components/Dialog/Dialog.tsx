import {
  forwardRef,
  useEffect,
  useRef,
  MouseEvent,
  ForwardedRef,
  useMemo,
} from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  bordersTemplate,
  useToken,
  useGlobalKeyPress,
  useHideBodyScroll,
  mergeRefs,
} from '@equinor/eds-utils'
import { Paper } from '../Paper'
import { dialog as dialogToken } from './Dialog.tokens'
import { useEds } from '../EdsProvider'

const StyledDialog = styled(Paper).attrs<DialogProps>({
  'aria-labelledby': 'eds-dialog-title',
  'aria-describedby': 'eds-dialog-customcontent',
})(({ theme }) => {
  return css`
    width: ${theme.width};
    background: ${theme.background};
    display: grid;
    grid-auto-columns: auto;
    ${typographyTemplate(theme.typography)};
    ${bordersTemplate(theme.border)};
    grid-gap: ${theme.spacings.bottom};
    overflow: hidden;
  `
})

const StyledNativeDialog = styled.dialog(({ theme }) => {
  return css`
    padding: 0;
    border: 0;
    overflow: visible;
    overscroll-behavior: contain;
    ${bordersTemplate(theme.border)};
    &::backdrop {
      background-color: ${theme.entities.scrim.background};
    }
  `
})

export type DialogProps = {
  /** Whether Dialog can be dismissed with esc key and outside click
   */
  isDismissable?: boolean
  /** programmatically toggle dialog */
  open: boolean
  /** callback to handle closing */
  onClose?: () => void
  /**
   * return focus to the previous focused element
   * @deprecated  Component is now based on native dialog where focus is handled by the browser automatically
   * */
  returnFocus?: boolean
  dialogRef?: ForwardedRef<HTMLDialogElement>
} & React.HTMLAttributes<HTMLDivElement>

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    children,
    open,
    onClose,
    isDismissable = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnFocus = true,
    dialogRef,
    ...props
  },
  ref,
) {
  const { density } = useEds()
  const localRef = useRef<HTMLDialogElement>(null)
  const token = useToken({ density }, dialogToken)
  const combinedDialogRef = useMemo(
    () => mergeRefs<HTMLDialogElement>(localRef, dialogRef),
    [localRef, dialogRef],
  )

  useEffect(() => {
    if (open && !localRef?.current?.hasAttribute('open')) {
      localRef?.current?.showModal()
    } else {
      localRef?.current?.close()
    }
  }, [open])

  //This might become redundant in the future, see https://github.com/whatwg/html/issues/7732
  useHideBodyScroll(open)

  const handleDismiss = (e: MouseEvent) => {
    const { target } = e
    if (target instanceof HTMLElement)
      if (isDismissable && target.nodeName === 'DIALOG') {
        onClose && onClose()
      }
  }
  useGlobalKeyPress('Escape', (e) => {
    e.preventDefault()
    if (isDismissable && onClose && open) {
      onClose && onClose()
    }
  })

  return (
    <ThemeProvider theme={token}>
      <StyledNativeDialog ref={combinedDialogRef} onMouseDown={handleDismiss}>
        {open && (
          <StyledDialog elevation="above_scrim" {...props} ref={ref}>
            {children}
          </StyledDialog>
        )}
      </StyledNativeDialog>
    </ThemeProvider>
  )
})

// Dialog.displayName = 'EdsDialog'
