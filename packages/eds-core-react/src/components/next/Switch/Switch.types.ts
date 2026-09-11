import type { InputHTMLAttributes, ReactNode } from 'react'

export type SwitchProps = {
  /**
   * Visible label for the switch (required).
   */
  label: ReactNode
  /** Custom class name, applied to the wrapping Field element (unlike
   * Checkbox/Radio, which apply it to the native input element) */
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
