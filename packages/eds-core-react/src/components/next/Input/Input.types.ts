import { InputHTMLAttributes, ReactNode } from 'react'

export type InputProps = {
  /** Invalid state - shows error styling */
  invalid?: boolean
  /** Text at the start (e.g., "$", "USD") - always neutral color */
  startText?: string
  /** Adornment at the start (icons, buttons, etc.) - inherits state color (red when invalid) */
  startAdornment?: ReactNode
  /** Text at the end (e.g., "km", "%") - always neutral color */
  endText?: string
  /** Adornment at the end (icons, buttons, etc.) - inherits state color (red when invalid) */
  endAdornment?: ReactNode
  /** Render as input or textarea */
  as?: 'input' | 'textarea'
} & InputHTMLAttributes<HTMLInputElement>
