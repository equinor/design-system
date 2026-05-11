import type { HTMLAttributes, ReactNode } from 'react'

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
  /** Called when the open state changes, from user interaction or controlled updates. */
  onOpenChange?: (open: boolean) => void
} & Omit<HTMLAttributes<HTMLDetailsElement>, 'onToggle'>

export type AccordionHeaderProps = {
  children: ReactNode
} & HTMLAttributes<HTMLElement>

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement>
