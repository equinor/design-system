import type { HTMLAttributes, ReactNode } from 'react'

export type ValidationMessageProps = {
  /** Disabled state - shows muted colors */
  disabled?: boolean
  /** Validation content */
  children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>
