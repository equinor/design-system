import type { ReactNode, TextareaHTMLAttributes } from 'react'

export type TextAreaProps = {
  /** Label for the field */
  label?: ReactNode
  /** Info tooltip content shown next to the label */
  labelInfo?: ReactNode
  /** Indicator text shown after label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
  /** Descriptive text that provides additional context for the field */
  description?: ReactNode
  /** Helper or validation message shown below the textarea */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
  /** Invalid state - shows error styling */
  invalid?: boolean
  /** Maximum number of rows before the textarea stops growing and becomes scrollable */
  maxRows?: number
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>
