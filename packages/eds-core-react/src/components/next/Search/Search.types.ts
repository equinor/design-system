import type { CSSProperties, ReactNode } from 'react'
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
  /** Accessible label for the clear button. Defaults to "Clear search". Override for localisation. */
  clearLabel?: string
  /**
   * CSS class names applied to the root element (the `<search>` wrapper).
   * Use this to control layout, width, or margin of the entire search field.
   */
  className?: string
  /** Inline styles applied to the root element (the `<search>` wrapper). */
  style?: CSSProperties
} & Omit<
  InputProps,
  | 'startAdornment'
  | 'endAdornment'
  | 'startText'
  | 'endText'
  | 'as'
  | 'hideErrorIcon'
  | 'type'
  | 'className'
  | 'style'
>
