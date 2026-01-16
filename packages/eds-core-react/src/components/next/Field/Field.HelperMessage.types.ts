import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Props for the Field.HelperMessage component.
 *
 * **Note:** Only one HelperMessage should be used per Field.
 * Using multiple instances within the same Field context is not supported
 * and may cause unexpected behavior with accessibility attributes.
 */
export type HelperMessageProps = {
  /** Helper message content */
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>
