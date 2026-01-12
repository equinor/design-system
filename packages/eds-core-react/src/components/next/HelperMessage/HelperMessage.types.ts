import type { HTMLAttributes, ReactNode } from 'react'

export type HelperMessageProps = {
  /** Disabled state - shows muted colors */
  disabled?: boolean
  /** Helper message content */
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>
