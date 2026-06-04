import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
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

const DialogContext = createContext<{ titleId: string } | null>(null)

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
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  const setRef = (node: HTMLDialogElement | null) => {
    dialogRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const handleClose = () => onOpenChange?.(false)

  // The native <dialog> reports the dialog itself as the click target when the
  // backdrop (the ::backdrop pseudo) is clicked. Children dispatch from their
  // own elements, so checking target === dialog isolates backdrop clicks.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onOpenChange?.(false)
  }

  // Default aria-labelledby to the auto-generated title id so Dialog.Title is
  // wired up without consumer boilerplate. Consumer can override with an
  // explicit aria-labelledby or aria-label.
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (ariaLabel ? undefined : titleId)

  return (
    <DialogContext.Provider value={{ titleId }}>
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
  function DialogHeader({ onClose, children, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={['header', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <div className="title-container">{children}</div>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            tone="accent"
            icon
            round
            onClick={onClose}
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
    return (
      <h2
        ref={ref}
        id={id ?? ctx?.titleId}
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
