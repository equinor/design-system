import type { HTMLAttributes, ReactNode } from 'react'

export type BannerTone = 'info' | 'warning' | 'danger'

export type BannerActionsPlacement = 'left' | 'bottom'

export type BannerProps = {
  /** Visual tone of the banner
   * @default 'info'
   */
  tone?: BannerTone
  /**
   * ARIA role. Use `'alert'` for urgent messages that require immediate attention.
   * @default 'status'
   */
  role?: HTMLAttributes<HTMLDivElement>['role']
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export type BannerIconProps = {
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

export type BannerMessageProps = {
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>

export type BannerActionsProps = {
  /**
   * Where to place the actions relative to the message.
   * - `left`: Actions appear inline to the right of the message
   * - `bottom`: Actions appear below the message, spanning full width
   * @default 'left'
   */
  placement?: BannerActionsPlacement
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>
