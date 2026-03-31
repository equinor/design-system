import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = {
  /** Content displayed inside the tooltip bubble */
  title?: ReactNode
  /** Placement of the tooltip relative to the anchor element
   * @default 'top'
   */
  placement?: TooltipPlacement
  /** Disable the tooltip */
  disabled?: boolean
  /** The element that triggers the tooltip on hover/focus */
  children: ReactElement<HTMLAttributes<HTMLElement>>
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>
