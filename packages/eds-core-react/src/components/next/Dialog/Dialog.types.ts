import type { DialogHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export type DialogProps = {
  /**
   * Controlled open state. When true, the dialog is shown via the native
   * `HTMLDialogElement.showModal()` (modal mode: focus trap + inert background).
   */
  open: boolean
  /**
   * Called when the dialog requests to close — via Escape key, backdrop click,
   * or any consumer-rendered close trigger. Update your `open` state in response.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Whether to render a visible backdrop (scrim) behind the dialog.
   * Defaults to true. Set to false for transparent backdrops.
   * @default true
   */
  scrim?: boolean
} & Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose'>

export type DialogHeaderProps = {
  /**
   * When provided, renders a close icon button at the end of the header
   * that invokes this handler. Omit to render the header without a close button.
   */
  onClose?: () => void
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>

export type DialogContentProps = HTMLAttributes<HTMLDivElement>

export type DialogActionsProps = HTMLAttributes<HTMLDivElement>
