import { ReactNode, HTMLAttributes } from 'react'

export type ValidationMessageProps = {
  /** Message content */
  children: ReactNode
  /** Disabled state */
  disabled?: boolean
} & HTMLAttributes<HTMLParagraphElement>
