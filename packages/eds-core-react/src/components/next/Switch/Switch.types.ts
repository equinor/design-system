import type { InputHTMLAttributes, ReactNode } from 'react'

export type SwitchProps = {
  /**
   * Visible label for the switch.
   * When no visible label is needed, use `aria-label` for accessibility.
   */
  label?: ReactNode
  /** If true, the switch will be disabled */
  disabled?: boolean
  /** Indicator text shown after the label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
  /** Helper message shown below the switch, useful for additional context */
  helperMessage?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
