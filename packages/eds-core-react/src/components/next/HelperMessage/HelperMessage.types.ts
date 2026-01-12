import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Props for the HelperMessage component.
 *
 * **Note:** Only one HelperMessage should be used per Field.
 * Using multiple instances within the same Field context is not supported
 * and may cause unexpected behavior with accessibility attributes.
 */
export type HelperMessageProps = {
  /** Disabled state - shows muted colors */
  disabled?: boolean
  /** Helper message content */
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>
