import type { HTMLAttributes, ReactElement } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = {
  /** Text displayed inside the tooltip bubble */
  title?: string
  /** Placement of the tooltip relative to the anchor element
   * @default 'top'
   */
  placement?: TooltipPlacement
  /** Disable the tooltip */
  disabled?: boolean
  /** The element that triggers the tooltip on hover/focus.
   * Must be a single React element. The trigger is wrapped in an inline-block span
   * for anchor positioning — use a wrapper div if full-width layout is needed.
   */
  children: ReactElement<HTMLAttributes<HTMLElement>>
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>
