import type { InputHTMLAttributes, ReactNode } from 'react'

export type SwitchProps = {
  /**
   * Visible label for the switch.
   * When no visible label is needed, use `aria-label` for accessibility.
   */
  label?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
