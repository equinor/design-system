import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { close as closeIcon } from '@equinor/eds-icons'
import { Button } from '../Button'
import { Icon } from '../Icon'
import type {
  DialogActionsProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
} from './Dialog.types'

type DialogContextValue = {
  titleId: string | undefined
  registerTitle: (id: string) => () => void
  close: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

const DialogRoot = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  {
    open,
    onOpenChange,
    scrim = true,
    className,
    children,
    'aria-labelledby': ariaLabelledBy,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  // Suppresses the onOpenChange call fired by the native `close` event when
  // we close the dialog in response to a consumer flipping `open` to false.
  // Without this, the consumer's setter would be called once externally and
  // once from handleClose — see review thread on PR #4956.
  const expectedCloseRef = useRef(false)
  // Records whether the mousedown that started a click landed on the dialog
  // element itself. Click fires on the common ancestor of mousedown/up, so a
  // text-selection drag that overshoots into the backdrop would otherwise be
  // mistaken for a backdrop click and close the dialog.
  const mouseDownOnDialogRef = useRef(false)
  const [titleId, setTitleId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      expectedCloseRef.current = true
      dialog.close()
    }
  }, [open])

  const setRef = (node: HTMLDialogElement | null) => {
    dialogRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const handleClose = () => {
    if (expectedCloseRef.current) {
      expectedCloseRef.current = false
      return
    }
    onOpenChange?.(false)
  }

  const handleMouseDown = (event: MouseEvent<HTMLDialogElement>) => {
    mouseDownOnDialogRef.current = event.target === dialogRef.current
  }

  // Native <dialog> reports the dialog itself as the click target when the
  // backdrop is clicked; children dispatch from their own elements. The
  // additional mousedown check guards against drag-out from a selection.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    const wasOnBackdrop =
      event.target === dialogRef.current && mouseDownOnDialogRef.current
    mouseDownOnDialogRef.current = false
    if (wasOnBackdrop) dialogRef.current?.close()
  }

  const close = useCallback(() => dialogRef.current?.close(), [])
  const registerTitle = useCallback((id: string) => {
    setTitleId(id)
    return () => setTitleId((current) => (current === id ? undefined : current))
  }, [])

  const ctxValue = useMemo<DialogContextValue>(
    () => ({ titleId, registerTitle, close }),
    [titleId, registerTitle, close],
  )

  // aria-labelledby resolves to the registered title id when a Dialog.Title is
  // present. Explicit aria-labelledby or aria-label on Dialog still wins.
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (ariaLabel ? undefined : titleId)

  return (
    <DialogContext.Provider value={ctxValue}>
      {/* Native <dialog> doesn't expose ::backdrop as a separately clickable
          element; a click whose target is the dialog itself comes from the
          backdrop. Keyboard dismissal (Escape) is handled by the native
          dialog and emits the `close` event we already wire up — no extra
          key handler. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={setRef}
        className={['eds-dialog', className].filter(Boolean).join(' ')}
        data-scrim={scrim || undefined}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-label={ariaLabel}
        onClose={handleClose}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </dialog>
    </DialogContext.Provider>
  )
})
DialogRoot.displayName = 'Dialog'

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ closable, children, className, ...rest }, ref) {
    const ctx = useContext(DialogContext)
    return (
      <div
        ref={ref}
        className={['header', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <div className="title-container">{children}</div>
        {closable && (
          <Button
            type="button"
            variant="ghost"
            tone="accent"
            icon
            round
            onClick={() => ctx?.close()}
            aria-label="Close"
          >
            <Icon data={closeIcon} />
          </Button>
        )}
      </div>
    )
  },
)
DialogHeader.displayName = 'Dialog.Header'

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ id, className, children, ...rest }, ref) {
    const ctx = useContext(DialogContext)
    const generatedId = useId()
    const resolvedId = id ?? generatedId

    useEffect(() => {
      if (!ctx) return
      return ctx.registerTitle(resolvedId)
    }, [ctx, resolvedId])

    return (
      <h2
        ref={ref}
        id={resolvedId}
        className={['title', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </h2>
    )
  },
)
DialogTitle.displayName = 'Dialog.Title'

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={['content', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
DialogContent.displayName = 'Dialog.Content'

const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(
  function DialogActions({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={['actions', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
DialogActions.displayName = 'Dialog.Actions'

type CompoundDialog = typeof DialogRoot & {
  Header: typeof DialogHeader
  Title: typeof DialogTitle
  Content: typeof DialogContent
  Actions: typeof DialogActions
}

export const Dialog = DialogRoot as CompoundDialog
Dialog.Header = DialogHeader
Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Actions = DialogActions
