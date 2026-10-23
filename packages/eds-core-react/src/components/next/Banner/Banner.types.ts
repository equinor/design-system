import type { HTMLAttributes, ReactNode } from 'react'

export type BannerTone = 'info' | 'warning' | 'danger' | 'success'

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
  /** Callback when the dismiss button is clicked. When provided, a close button is rendered. */
  onDismiss?: () => void
  /** The banner content, built from `Banner.Icon`, `Banner.Message` and `Banner.Actions`. */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export type BannerIconProps = {
  /** The icon. Banner does not add one for the tone. */
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

export type BannerMessageProps = {
  /** The message text. */
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>

export type BannerActionsProps = {
  /**
   * Where to place the actions relative to the message. `left` puts them
   * beside the message and `bottom` puts them below it, across the full width.
   * @default 'left'
   */
  placement?: BannerActionsPlacement
  /** The buttons or links the user can respond to the message with. */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>
