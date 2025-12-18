import type { HTMLAttributes, ReactNode } from 'react'

export type ValidationMessageTone = 'danger' | 'warning' | 'success' | 'info'

export type ValidationMessageProps = {
  /** Tone used to determine colors */
  tone?: ValidationMessageTone
  /** Disabled state - shows muted colors */
  disabled?: boolean
  /** Validation content */
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>
