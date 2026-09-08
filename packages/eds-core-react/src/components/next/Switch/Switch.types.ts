import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'

export type SwitchProps = {
  /**
   * Visible label for the switch (required).
   */
  label: ReactNode
  /** CSS class names applied to the outer wrapper element, not the hidden input */
  className?: string
  /** Inline styles applied to the outer wrapper element, not the hidden input */
  style?: CSSProperties
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'style'>
