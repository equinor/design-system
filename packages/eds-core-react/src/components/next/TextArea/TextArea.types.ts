import type { CSSProperties, ReactNode, TextareaHTMLAttributes } from 'react'

export type TextAreaProps = {
  /** Label for the field */
  label?: ReactNode
  /** Info tooltip content shown next to the label */
  labelInfo?: string
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
  /** Show a character count below the textarea. Displays "n / max" when `maxLength` is set, otherwise just "n" */
  showCharacterCount?: boolean
  /** CSS class names applied to the root element (the outer labeled field wrapper). */
  className?: string
  /** Inline styles applied to the root element (the outer labeled field wrapper). */
  style?: CSSProperties
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'className' | 'style'
>
