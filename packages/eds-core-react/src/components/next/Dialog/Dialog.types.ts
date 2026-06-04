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
   * Renders a close icon button at the end of the header that closes the
   * dialog (firing the parent `Dialog`'s `onOpenChange(false)` exactly once).
   * Set to `false` for decision-forcing dialogs where the user must pick an
   * action.
   * @default true
   */
  closable?: boolean
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>

/**
 * The dialog title. Defaults to an `<h2>`. If `id` is omitted, an id is
 * auto-generated and wired up to the parent `Dialog`'s `aria-labelledby`,
 * so the dialog is correctly labelled without consumer boilerplate.
 */
export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>

/**
 * The dialog's main content region. Children are laid out in a vertical
 * stack with consistent spacing — wrap mixed inline/block content in a
 * block-level element (e.g. `<p>`) to avoid each inline becoming its own row.
 */
export type DialogContentProps = HTMLAttributes<HTMLDivElement>

/** The dialog's action row, right-aligned, intended for Button children. */
export type DialogActionsProps = HTMLAttributes<HTMLDivElement>
