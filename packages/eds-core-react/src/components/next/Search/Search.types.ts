import type { ReactNode } from 'react'
import type { InputProps } from '../Input/Input.types'

export type SearchProps = {
  /** Label for the field */
  label?: ReactNode
  /** Descriptive text that provides additional context for the field */
  description?: ReactNode
  /** Helper or validation message shown below the input */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
  /** Callback fired when the clear button is clicked */
  onClear?: () => void
} & Omit<
  InputProps,
  | 'startAdornment'
  | 'endAdornment'
  | 'startText'
  | 'endText'
  | 'as'
  | 'hideErrorIcon'
  | 'type'
>
