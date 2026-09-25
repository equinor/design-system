import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'

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
  /**
   * Render as input or textarea.
   * @internal Use the TextArea component instead of `as="textarea"`.
   */
  as?: 'input' | 'textarea'
  /**
   * CSS class names applied to the root element (the visual input container with border and focus ring).
   * Use this to control layout, width, or appearance of the input widget.
   */
  className?: string
  /** Inline styles applied to the root element (the visual input container). */
  style?: CSSProperties
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style'>
