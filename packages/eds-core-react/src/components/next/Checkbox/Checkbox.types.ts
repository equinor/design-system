import type { InputHTMLAttributes, ReactNode } from 'react'

export type CheckboxProps = {
  /** Label for the checkbox */
  label?: ReactNode
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. The component sets the
   * native element's `indeterminate` property for you.
   */
  indeterminate?: boolean
  /** Indicator text shown after the label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
  /** Helper message shown below the checkbox, useful for additional context */
  helperMessage?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
