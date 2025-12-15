import type { HTMLAttributes, ReactNode } from 'react'

export type ValidationMessageTone = 'danger' | 'warning' | 'success' | 'info'

export type ValidationMessageProps = {
  /** Tone used to determine colors */
  tone?: ValidationMessageTone
  /** Validation content */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>
