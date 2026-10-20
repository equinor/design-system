import type { HTMLAttributes, ReactElement } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = {
  /** Text displayed inside the tooltip bubble */
  title?: string
  /** Preferred placement of the tooltip relative to the anchor element.
   * Named after the side the tooltip sits on, not the side the arrow points from.
   * If that side does not fit in the viewport, the tooltip falls back to the
   * opposite side, then to the perpendicular sides. Pick `left` or `right`
   * explicitly for triggers in corners if you want to control which side is used.
   * @default 'bottom'
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
