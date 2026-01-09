import { ReactNode, HTMLAttributes } from 'react'

export type HelperMessageProps = {
  /** Message content */
  children: ReactNode
  /** Disabled state */
  disabled?: boolean
} & HTMLAttributes<HTMLParagraphElement>
