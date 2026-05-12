import type { DetailsHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export type AccordionProps = {
  /**
   * When true, only one item can be open at a time within this group.
   * Uses the native `name` attribute on `<details>` — no JS state machine.
   */
  exclusive?: boolean
} & HTMLAttributes<HTMLDivElement>

export type AccordionItemProps = {
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Controlled open state. When provided, the item is controlled. */
  open?: boolean
  /**
   * Called when the open state changes from a user toggle. Not fired when the
   * controlled `open` prop is updated from the parent.
   */
  onOpenChange?: (open: boolean) => void
} & Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'onToggle' | 'open'>

export type AccordionHeaderProps = {
  children: ReactNode
} & HTMLAttributes<HTMLElement>

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement>
