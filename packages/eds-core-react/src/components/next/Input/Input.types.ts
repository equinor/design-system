import { InputHTMLAttributes, ReactNode } from 'react'

export type InputProps = {
  /** Invalid state - shows error styling */
  invalid?: boolean
  /** Hide error icon when invalid - defaults to false (icon shows by default) */
  hideErrorIcon?: boolean
  /** Text at the start (e.g., "https://", "NOK") */
  startText?: string
  /** Adornment at the start (icons, buttons, etc.) */
  startAdornment?: ReactNode
  /** Text at the end (e.g., "km", "%") */
  endText?: string
  /** Adornment at the end (icons, buttons, etc.) */
  endAdornment?: ReactNode
  /** Render as input or textarea */
  as?: 'input' | 'textarea'
  /** Class name applied to the container element */
  containerClassName?: string
} & InputHTMLAttributes<HTMLInputElement>
