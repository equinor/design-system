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
import { Button, ButtonProps } from '../Button'
import { Icon } from '../Icon'
import type {
  DialogActionsProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogPopupProps,
  DialogProps,
  DialogTitleProps,
} from './Dialog.types'
import { Slot } from '../Slot'

type DialogContextValue = {
  titleId: string | undefined
  registerTitle: (id: string) => () => void
  close: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  dialogRef: React.RefObject<HTMLDialogElement | null>
}

const DialogContext = createContext<DialogContextValue | null>(null)

const DialogRoot = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [titleId, setTitleId] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(openProp ?? false)

  const onOpenChange = onOpenChangeProp ?? setOpen

  const close = useCallback(() => dialogRef.current?.close(), [])

  const registerTitle = useCallback((id: string) => {
    setTitleId(id)
    return () => setTitleId((current) => (current === id ? undefined : current))
  }, [])

  const ctxValue = useMemo<DialogContextValue>(
    () => ({
      titleId,
      registerTitle,
      close,
      open,
      onOpenChange,
      dialogRef,
    }),
    [titleId, registerTitle, close, open, onOpenChange, dialogRef],
  )

  return (
    <DialogContext.Provider value={ctxValue}>{children}</DialogContext.Provider>
  )
}

const DialogPopup = forwardRef<HTMLDialogElement, DialogPopupProps>(
  function DialogPopup(
    {
      scrim = true,
      className,
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    // Records whether the mousedown that started a click landed on the dialog
    // element itself. Click fires on the common ancestor of mousedown/up, so a
    // text-selection drag that overshoots into the backdrop would otherwise be
    // mistaken for a backdrop click and close the dialog.
    const mouseDownOnDialogRef = useRef(false)
    const ctx = useDialogContext()
    const expectedCloseRef = useRef(false)
    useEffect(() => {
      const dialog = ctx.dialogRef.current
      if (!dialog) return
      if (ctx.open && !dialog.open) {
        dialog.showModal()
      } else if (!ctx.open && dialog.open) {
        expectedCloseRef.current = true
        dialog.close()
      }
    }, [ctx.open, ctx.dialogRef])

    const setRef = useCallback(
      (node: HTMLDialogElement | null) => {
        ctx.dialogRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref, ctx],
    )

    const resolvedAriaLabelledBy =
      ariaLabelledBy ?? (ariaLabel ? undefined : ctx?.titleId)
    const handleClose = () => {
      if (expectedCloseRef.current) {
        expectedCloseRef.current = false
        return
      }
      ctx?.onOpenChange?.(false)
    }

    const handleMouseDown = (event: MouseEvent<HTMLDialogElement>) => {
      mouseDownOnDialogRef.current = event.target === ctx?.dialogRef.current
    }

    // Native <dialog> reports the dialog itself as the click target when the
    // backdrop is clicked; children dispatch from their own elements. The
    // additional mousedown check guards against drag-out from a selection.
    const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
      const wasOnBackdrop =
        event.target === ctx?.dialogRef.current && mouseDownOnDialogRef.current
      mouseDownOnDialogRef.current = false
      if (wasOnBackdrop) ctx?.dialogRef.current?.close()
    }

    return (
      <>
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
      </>
    )
  },
)
DialogPopup.displayName = 'Dialog.Popup'

const DialogTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function DialogTrigger(
    { className, children, asChild, onClick, ...rest },
    ref,
  ) {
    const ctx = useDialogContext()
    const classes = ['dialog-button', className].filter(Boolean).join(' ')
    const onClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
      ctx.onOpenChange(true)
      onClick?.(e)
    }

    const sharedProps = {
      ref,
      className: classes,
      onClick: onClickHandler,
      ...rest,
    }
    if (asChild) {
      return <Slot {...sharedProps}>{children}</Slot>
    }
    return <Button {...sharedProps}>{children}</Button>
  },
)
DialogTrigger.displayName = 'Dialog.Trigger'

const DialogClose = forwardRef<HTMLButtonElement, ButtonProps>(
  function DialogClose(
    { className, children, asChild, onClick, ...rest },
    ref,
  ) {
    const ctx = useDialogContext()
    const classes = ['dialog-button', className].filter(Boolean).join(' ')
    const onClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
      ctx.close()
      onClick?.(e)
    }

    const sharedProps = {
      ref,
      className: classes,
      onClick: onClickHandler,
      ...rest,
    }
    if (asChild) {
      return <Slot {...sharedProps}>{children}</Slot>
    }

    return (
      <Button variant="secondary" {...sharedProps}>
        {children}
      </Button>
    )
  },
)
DialogClose.displayName = 'Dialog.Close'

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ children, className, ...rest }, ref) {
    const ctx = useDialogContext()
    return (
      <div
        ref={ref}
        className={['header', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <div className="title-container">{children}</div>
        <Button
          type="button"
          variant="ghost"
          tone="accent"
          icon
          round
          onClick={() => ctx.close()}
          aria-label="Close"
        >
          <Icon data={closeIcon} />
        </Button>
      </div>
    )
  },
)
DialogHeader.displayName = 'Dialog.Header'

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ id, className, children, ...rest }, ref) {
    const ctx = useDialogContext()
    const generatedId = useId()
    const resolvedId = id ?? generatedId

    useEffect(() => {
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
  Trigger: typeof DialogTrigger
  Popup: typeof DialogPopup
  Close: typeof DialogClose
}

export const Dialog = DialogRoot as CompoundDialog
Dialog.Header = DialogHeader
Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Actions = DialogActions
Dialog.Trigger = DialogTrigger
Dialog.Popup = DialogPopup
Dialog.Close = DialogClose

const useDialogContext = () => {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error('Dialog compound components must be wrapped in <Dialog />')
  }
  return ctx
}
