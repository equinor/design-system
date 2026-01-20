import { ReactNode } from 'react'

export type InputProps = {
  /** Placeholder text */
  placeholder?: string
  /** Invalid state - shows error styling */
  invalid?: boolean
  /** Disables element */
  disabled?: boolean
  /** Input type (e.g., "text", "number", "email", "password") */
  type?: string
  /** Toggle read only state */
  readOnly?: boolean
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
  /** Additional CSS class names */
  className?: string
}
